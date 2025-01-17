import { Repository, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { EventDomain as Event } from '@/events/domain/event';
import { EventRepository } from '@/events/event.abstract.repository';
import { EventMapper } from '@/events/persistance/mappers/event.mapper';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventEntity,
  EventPermission,
} from '@/events/persistance/entities/event.entity';
import { RequestContextService } from '@/utils/request-context-service';
import { UserDomain as User } from '@/users/domain/user';

@Injectable()
export class EventRelationalRepository implements EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly requestContextService: RequestContextService,
  ) {}

  findAllMyEventsWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Event[]> {
    console.log(JSON.stringify(paginationOptions));
    throw new Error('Method not implemented.');
  }

  async create(data: Event): Promise<Event> {
    const persistenceModel = EventMapper.toPersistence(data);
    const newEntity = await this.eventRepository.save(
      this.eventRepository.create(persistenceModel),
    );
    return EventMapper.toDomain(newEntity);
  }

  async findAllWithPagination(
    {
      paginationOptions,
    }: {
      paginationOptions: IPaginationOptions;
    },
    loggedUser,
  ): Promise<Event[]> {
    let currentUser: User | null | undefined = null;

    if (loggedUser) {
      try {
        currentUser =
          await this.requestContextService.getDataWithContext<User>('user');
      } catch (error) {
        console.error(error);
      }
    }

    const entities = await this.eventRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['participants'],
      where: {
        participants: { id: currentUser?.id },
      },
    });

    return entities.map((entity) => EventMapper.toDomain(entity));
  }

  async findById(id: Event['id']): Promise<Event | null> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!event) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Event with id ${id} not found`,
      });
    }

    let currentUser: User | null | undefined = null;

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }

    // Récupérer l'utilisateur actuel (celui qui fait la requête)
    try {
      currentUser =
        await this.requestContextService.getDataWithContext<User>('user');
    } catch (error) {
      console.error(error);
    }

    if (!currentUser) {
      throw new NotFoundException(
        `Unable to retrive this Event, try to authenticate and then retry`,
      );
    }

    if (event.permissions?.[currentUser.id]?.includes(EventPermission.ALL)) {
      return event ? EventMapper.toDomain(event) : null;
    }

    if (
      !event.permissions ||
      !event?.permissions?.[currentUser.id] ||
      !event?.permissions?.[currentUser.id]?.includes(EventPermission.READ) ||
      !event.permissions?.[currentUser.id]?.includes(EventPermission.READ_ONLY)
    ) {
      throw new ForbiddenException(
        'You do not have permission to read this event.',
      );
    }

    return event ? EventMapper.toDomain(event) : null;
  }

  async findByIds(ids: Event['id'][]): Promise<Event[]> {
    const events = await this.eventRepository.find({
      where: { id: In(ids) },
      relations: ['participants'],
    });

    return events.map((entity) => EventMapper.toDomain(entity));
  }

  async update(id: Event['id'], payload: Partial<Event>): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!event) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Event with id ${id} not found`,
      });
    }

    const updatedEntity = await this.eventRepository.save(
      this.eventRepository.create(
        EventMapper.toPersistence({
          ...EventMapper.toDomain(event),
          ...payload,
        }),
      ),
    );

    return EventMapper.toDomain(updatedEntity);
  }

  async remove(id: Event['id']): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!event) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Event with id ${id} not found`,
      });
    }

    event.participants = [];
    await this.eventRepository.save(event);

    await this.eventRepository.delete(id);
  }

  /**
   * Find all events for a specific participant by their ID.
   * @param id The ID of the participant.
   * @returns List of events the participant is involved in.
   */
  async findByParticipantId(id: number): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['participants'],
      where: {
        participants: { id },
      },
    });
  }

  async findUsersWithConflictingEvents(
    startTime: Date,
    endTime: Date,
    userIds: number[],
  ): Promise<User[]> {
    // Récupérer les événements des utilisateurs spécifiés
    const events = await this.eventRepository.find({
      where: {
        participants: {
          id: In(userIds),
        },
        startTime: MoreThanOrEqual(startTime),
        endTime: LessThanOrEqual(endTime),
      },
      relations: ['participants'],
    });

    // Vérifier les utilisateurs ayant des événements qui chevauchent la plage horaire
    const conflictingUsers: User[] = [];
    events.forEach((event) => {
      const participants = event.participants || [];
      participants.forEach((participant) => {
        if (!conflictingUsers.some((user) => user.id === participant.id)) {
          conflictingUsers.push(participant);
        }
      });
    });

    return conflictingUsers;
  }

  async checkPermissionToModify(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
    let currentUser: User | null | undefined = null;

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }

    // Récupérer l'utilisateur actuel (celui qui fait la requête)
    try {
      currentUser =
        await this.requestContextService.getDataWithContext<User>('user');
    } catch (error) {
      console.error(error);
    }

    if (!currentUser) {
      throw new NotFoundException(
        `Unable to modify this Event, try to authenticate and then retry`,
      );
    }

    if (event.permissions?.[currentUser.id].includes(EventPermission.ALL)) {
      return event;
    }

    // Vérifier si l'utilisateur est un organisateur ou a des permissions suffisantes
    if (
      !event.permissions ||
      !event.permissions?.[currentUser?.id] ||
      !event.permissions?.[currentUser?.id]?.includes(EventPermission.MODIFY)
    ) {
      throw new ForbiddenException(
        'You do not have permission to modify this event.',
      );
    }

    return event;
  }

  async checkPermissionToDelete(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    let currentUser: User | null | undefined = null;

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }

    // Récupérer l'utilisateur actuel (celui qui fait la requête)
    try {
      currentUser =
        await this.requestContextService.getDataWithContext<User>('user');
    } catch (error) {
      console.error(error);
    }

    if (!currentUser) {
      throw new NotFoundException(
        `Unable to delete this Event, try to authenticate and then retry`,
      );
    }

    // Vérifier si l'utilisateur est un administrateur ou un organisateur

    if (event.permissions?.[currentUser.id]?.includes(EventPermission.ALL)) {
      return event;
    }

    if (
      !event.permissions ||
      !event?.permissions?.[currentUser?.id] ||
      !event?.permissions?.[currentUser?.id]?.includes(EventPermission.DELETE)
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this event.',
      );
    }

    return event;
  }
}
