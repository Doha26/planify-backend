import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.abstract.repository';
import { UserDomain as User } from './domain/user';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UpdateUserDto } from './dto/update-user.dto';
import { EventDomain as Event } from '../events/domain/event';
import { EventsService } from '../events/events.service';
import { RoleEnum } from '../utils/shared/roles.enum';
import { StatusEnum } from '../utils/shared/statuses.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    @Inject(forwardRef(() => EventsService))
    private readonly eventsService: EventsService,
  ) {}

  /**
   * Creates a new user and validates the input data.
   * Ensures email uniqueness, hashes the password if provided, and associates events and groups.
   *
   * @param createUserDto Data for creating the user.
   * @returns The newly created user.
   * @throws UnprocessableEntityException If the email is missing, already exists,
   * or if one or more provided events are invalid.
   */

  async create(createUserDto: CreateUserDto): Promise<User> {
    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    if (!createUserDto.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          events: 'Email is required to create user',
        },
      });
    }

    let email: string = '';

    const userObject = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailAlreadyExists',
        },
      });
    }
    email = createUserDto.email;

    const provider = createUserDto.provider ?? AuthProvidersEnum.email;

    let groups: string[] = [];
    if (createUserDto.groups && Array.isArray(createUserDto.groups)) {
      groups = createUserDto.groups;
    }

    let events: Event[] = [];
    if (createUserDto.events?.length) {
      const eventObjects = await this.eventsService.findByIds(
        createUserDto.events,
      );

      if (eventObjects.length !== createUserDto.events.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            events: 'One or More Events with provided UUID not found',
          },
        });
      }

      events = eventObjects;
    }

    return await this.usersRepository.create({
      email,
      password,
      role: createUserDto.role || RoleEnum.USER,
      status: createUserDto.status || StatusEnum.INACTIVE,
      provider,
      events,
      groups,
      socialId: createUserDto.socialId,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });
  }

  /**
   * Retrieves a list of users based on filter, sort, and pagination options.
   *
   * @param options Object containing:
   * - `filterOptions`: Optional filter criteria for users.
   * - `sortOptions`: Optional sort criteria for users.
   * - `paginationOptions`: Pagination details, including page and limit.
   * @returns A paginated list of users matching the criteria.
   */

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  /**
   * Finds a user by their unique ID.
   *
   * @param id The unique identifier of the user.
   * @returns The user object if found, otherwise `null`.
   */

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  /**
   * Finds multiple users by their IDs.
   *
   * @param ids An array of user IDs.
   * @returns A list of users matching the provided IDs.
   */
  findByIds(ids: User['id'][]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }

  /**
   * Finds a user by their email address.
   *
   * @param email The email address of the user.
   * @returns The user object if found, otherwise `null`.
   */
  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  /**
   * Finds a user by their social ID and authentication provider.
   *
   * @param params Object containing:
   * - `socialId`: The social ID of the user.
   * - `provider`: The authentication provider of the user.
   * @returns The user object if found, otherwise `null`.
   */
  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    return this.usersRepository.findBySocialIdAndProvider({
      socialId,
      provider,
    });
  }

  /**
   * Updates a user's information, including optional password hashing and email validation.
   *
   * @param id The unique identifier of the user to update.
   * @param updateUserDto Data for updating the user.
   * @returns The updated user object, or `null` if the user doesn't exist.
   * @throws UnprocessableEntityException If the email already exists for another user.
   */
  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    return this.usersRepository.update(id, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      role: updateUserDto.role,
      status: updateUserDto.status,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
    });
  }

  /**
   * Deletes a user from the system by their ID.
   *
   * @param id The unique identifier of the user to remove.
   * @returns A promise that resolves when the operation is complete.
   */
  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }
}
