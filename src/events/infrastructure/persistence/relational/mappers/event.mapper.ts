import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { EventDomain as Event } from '../../../../domain/event';
import { EventEntity } from '../entities/event.entity';

export class EventMapper {
  static toDomain(entityObject: EventEntity): Event {
    const domainEntity = new Event();
    domainEntity.id = entityObject.id;
    domainEntity.createdAt = entityObject.createdAt;
    domainEntity.updatedAt = entityObject.updatedAt;

    domainEntity.title = entityObject.title;
    domainEntity.startTime = entityObject.startTime;
    domainEntity.endTime = entityObject.endTime;
    domainEntity.type = entityObject.type;
    domainEntity.participants = entityObject?.participants;
    domainEntity.permissions = entityObject.permissions;
    domainEntity.description = entityObject.description;
    domainEntity.location = entityObject.location;
    domainEntity.isRecurring = entityObject.isRecurring;
    domainEntity.recurrencePattern = entityObject.recurrencePattern;

    return domainEntity;
  }

  static toPersistence(domainObject: Event): EventEntity {
    const persistenceEntity = new EventEntity();
    if (domainObject.id && typeof domainObject.id === 'number') {
      persistenceEntity.id = domainObject.id;
    }
    persistenceEntity.createdAt = domainObject.createdAt;
    persistenceEntity.updatedAt = domainObject.updatedAt;

    persistenceEntity.participants = domainObject.participants?.map(
      (participant) => UserMapper.toPersistence(participant),
    );

    persistenceEntity.title = domainObject.title;
    persistenceEntity.startTime = domainObject.startTime;
    persistenceEntity.endTime = domainObject.endTime;
    persistenceEntity.type = domainObject.type;
    persistenceEntity.description = domainObject.description;
    persistenceEntity.location = domainObject.location;
    persistenceEntity.isRecurring = domainObject.isRecurring;
    persistenceEntity.recurrencePattern = domainObject.recurrencePattern;
    persistenceEntity.permissions = domainObject.permissions;
    persistenceEntity.location = domainObject.location;
    persistenceEntity.isRecurring = domainObject.isRecurring;

    return persistenceEntity;
  }
}
