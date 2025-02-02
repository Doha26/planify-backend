import { UserDomain as User } from '@/users/domain/user';
import { DeepPartial } from '@/utils/types/deep-partial.type';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EventDomain as Event } from '@/events/domain/event';

export abstract class EventRepository {
  abstract create(
    data: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Event>;

  abstract findAllWithPagination(
    {
      paginationOptions,
    }: {
      paginationOptions: IPaginationOptions;
    },
    currentUser?: boolean,
  ): Promise<Event[]>;

  abstract findAllMyEventsWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Event[]>;

  abstract findById(id: Event['id']): Promise<NullableType<Event>>;

  abstract findByIds(ids: Event['id'][]): Promise<Event[]>;

  abstract update(
    id: Event['id'],
    payload: DeepPartial<Event>,
  ): Promise<Event | null>;

  abstract remove(id: Event['id']): Promise<void>;
  abstract findByParticipantId(participantId: number): Promise<Event[]>;

  abstract findUsersWithConflictingEvents(
    startTime: Date,
    endTime: Date,
    userIds: number[],
  ): Promise<User[]>;

  abstract checkPermissionToDelete(id: number): Promise<Event>;

  abstract checkPermissionToModify(id: number): Promise<Event>;
}
