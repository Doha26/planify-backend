import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './infrastructure/persistence/event.abstract.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { EventDomain as Event } from './domain/event';
import { UserDomain as User } from '../users/domain/user';
import { UsersService } from '../users/users.service';
import { EventPermission } from './infrastructure/persistence/relational/entities/event.entity';
import { NullableType } from '../utils/types/nullable.type';
import { RequestContextService } from '../utils/request-context-service';

/**
 * Service for managing events, including creation, updating, deletion,
 * and conflict detection for event schedules.
 */

@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly requestContext: RequestContextService,
  ) {}

  /**
   * Creates a new event and adds the creator as the first participant.
   * Additional participants can be added based on the provided payload.
   *
   * @param createEventDto Data for creating the event.
   * @returns The newly created event.
   * @throws NotFoundException If any user in the participants list is not found.
   */
  async create(createEventDto: CreateEventDto) {
    const eventType = createEventDto.type;
    const participants: User[] = [];
    const eventCreator = await this.requestContext.get('user');

    if (eventCreator) {
      participants.push(eventCreator); // Add the user that create the event as the first participants
    }

    // Add other participants if their ID added to the payload
    if (createEventDto.participants && createEventDto.participants.length > 0) {
      for (const userId of createEventDto.participants) {
        const user = await this.usersService.findById(userId);
        if (!user) {
          throw new NotFoundException({
            status: HttpStatus.NOT_FOUND,
            message: `User with id: ${userId} not found.`,
          });
        }
        participants.push(user); // Add the user to participants array
      }
    }
    const event = {
      title: createEventDto.title,
      startTime: createEventDto.startTime,
      endTime: createEventDto.endTime,
      type: eventType,
      participants: participants,
      description: createEventDto.description || '',
      location: createEventDto.location || '',
      isRecurring: createEventDto.isRecurring ?? false,
      recurrencePattern: createEventDto.recurrencePattern || '',
      permissions: createEventDto.permissions || {}, // Assuming permissions are provided as an object
    };
    // Save the event to the repository
    return await this.eventRepository.create(event);
  }

  /**
   * Adds participants to an existing event with specified permissions.
   *
   * @param eventId The ID of the event to which participants will be added.
   * @param userIdsWithPermissions List of users with their corresponding permissions.
   * @returns The updated event with the new participants.
   * @throws NotFoundException If the event or any user in the list is not found.
   */
  async addParticipant(
    eventId: number,
    userIdsWithPermissions: {
      userId: number;
      permissions: EventPermission[];
    }[],
  ): Promise<Event | null> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Event With Id: ${eventId} not found.`,
      });
    }
    const userIds = userIdsWithPermissions.map((entry) => entry.userId);
    const users = await this.usersService.findByIds(userIds);

    if (users.length !== userIds.length) {
      const missingUserIds = userIds.filter(
        (id) => !users.some((user) => user.id === id),
      );
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Users with IDs: ${missingUserIds.join(', ')} not found.`,
      });
    }

    // Ensure participants array is initialized
    event.participants = event.participants || [];

    // Add new participants without duplicates
    const existingParticipantIds = new Set(
      event.participants.map((participant) => participant.id),
    );
    const newParticipants = users.filter(
      (user) => !existingParticipantIds.has(user.id),
    );

    event.participants = [...event.participants, ...newParticipants];

    // Step 4: Update the permissions for each user
    const updatedPermissions = event.permissions || {}; // Initialize permissions if not set

    userIdsWithPermissions.forEach(({ userId, permissions }) => {
      if (!updatedPermissions[userId]) {
        // Initialize an array if no permissions exist for the user
        updatedPermissions[userId] = [];
      }

      // Merge permissions without duplicating existing ones
      updatedPermissions[userId] = Array.from(
        new Set([...updatedPermissions[userId], ...permissions]),
      );
    });

    event.permissions = updatedPermissions;

    return this.eventRepository.update(eventId, event);
  }

  /**
   * Detects scheduling conflicts for a list of users within a specified time range.
   *
   * @param userIds List of user IDs to check for conflicts.
   * @param proposedStartTime Start time of the proposed schedule.
   * @param proposedEndTime End time of the proposed schedule.
   * @returns A list of users with conflicting events, including details of the conflicts.
   */
  async detectScheduleConflicts(
    userIds: number[],
    proposedStartTime: Date,
    proposedEndTime: Date,
  ): Promise<{ userId: number; conflicts: Event[] }[]> {
    const users = await this.usersService.findByIds(userIds);

    if (users.length !== userIds.length) {
      const missingUserIds = userIds.filter(
        (id) => !users.some((user) => user.id === id),
      );
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Users with IDs: ${missingUserIds.join(', ')} not found.`,
      });
    }

    const conflicts = await Promise.all(
      users.map(async (user) => {
        const events = await this.eventRepository.findByParticipantId(user.id);
        const conflictingEvents = events.filter((event) => {
          return (
            (proposedStartTime >= event.startTime &&
              proposedStartTime < event.endTime) ||
            (proposedEndTime > event.startTime &&
              proposedEndTime <= event.endTime) ||
            (proposedStartTime <= event.startTime &&
              proposedEndTime >= event.endTime)
          );
        });

        return { userId: user.id, conflicts: conflictingEvents };
      }),
    );

    return conflicts.filter((conflict) => conflict.conflicts.length > 0);
  }

  /**
   * Vérifie les conflits d'horaire pour une liste d'utilisateurs et une plage horaire donnée.
   * @param startTime Début de la plage horaire
   * @param endTime Fin de la plage horaire
   * @param userIds Liste des ID des utilisateurs à vérifier
   * @returns Liste des utilisateurs ayant des conflits d'horaires
   */
  async checkScheduleConflicts(
    startTime: Date,
    endTime: Date,
    userIds: number[],
  ): Promise<User[]> {
    return this.eventRepository.findUsersWithConflictingEvents(
      startTime,
      endTime,
      userIds,
    );
  }

  /**
   * Retrieves a paginated list of events.
   *
   * @param paginationOptions Options for pagination (page number and limit).
   * @param loggedUser Whether to fetch events specific to the logged-in user.
   * @returns A paginated list of events.
   */
  findAllWithPagination(
    {
      paginationOptions,
    }: {
      paginationOptions: IPaginationOptions;
    },
    loggedUser?: boolean,
  ): Promise<Event[]> {
    return this.eventRepository.findAllWithPagination(
      {
        paginationOptions: {
          page: paginationOptions.page,
          limit: paginationOptions.limit,
        },
      },
      loggedUser,
    );
  }

  /**
   * Finds an event by its ID.
   *
   * @param id The ID of the event.
   * @returns The event if found, or null if not found.
   */
  findById(id: Event['id']): Promise<NullableType<Event>> {
    return this.eventRepository.findById(id);
  }

  /**
   * Finds multiple events by their IDs.
   *
   * @param ids Array of event IDs.
   * @returns A list of events that match the provided IDs.
   */
  findByIds(ids: Event['id'][]): Promise<Event[]> {
    return this.eventRepository.findByIds(ids);
  }

  /**
   * Updates an existing event with new data.
   *
   * @param id The ID of the event to update.
   * @param updateEventDto Data for updating the event.
   * @returns The updated event.
   * @throws NotFoundException If the event is not found.
   */
  async update(
    id: Event['id'],
    updateEventDto: UpdateEventDto,
  ): Promise<Event | null> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Event with id ${id} not found`,
      });
    }

    // Update event properties
    Object.assign(event, updateEventDto);

    return this.eventRepository.update(id, event);
  }

  /**
   * Deletes an event by its ID.
   *
   * @param id The ID of the event to delete.
   * @returns A promise that resolves when the event is deleted.
   */
  remove(id: Event['id']): Promise<void> {
    return this.eventRepository.remove(id);
  }

  /**
   * Checks if the current user has permission to modify the event.
   *
   * @param id The ID of the event.
   * @returns The event if the user has modification permissions.
   * @throws ForbiddenException If the user lacks permissions.
   */
  checkPermissionToModify(id: number): Promise<Event> {
    return this.eventRepository.checkPermissionToModify(id);
  }

  /**
   * Checks if the current user has permission to delete the event.
   *
   * @param id The ID of the event.
   * @returns The event if the user has deletion permissions.
   * @throws ForbiddenException If the user lacks permissions.
   */
  checkPermissionToDelete(id: number): Promise<Event> {
    return this.eventRepository.checkPermissionToDelete(id);
  }
}
