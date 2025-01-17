import { EventMapper } from '@/events/persistance/mappers/event.mapper';
import { UserDomain as User } from '@/users/domain/user';
import { UserEntity } from '@/users/persistance/entities/user.entity';

export class UserMapper {
  static toDomain(entityObject: UserEntity): User {
    const domainEntity = new User();
    domainEntity.id = entityObject.id;
    domainEntity.email = entityObject.email;
    domainEntity.password = entityObject.password;
    domainEntity.provider = entityObject.provider;
    domainEntity.socialId = entityObject.socialId;
    domainEntity.firstName = entityObject.firstName;
    domainEntity.lastName = entityObject.lastName;
    domainEntity.role = entityObject.role;
    domainEntity.events = entityObject.events;
    domainEntity.status = entityObject.status;
    domainEntity.createdAt = entityObject.createdAt;
    domainEntity.updatedAt = entityObject.updatedAt;
    domainEntity.deletedAt = entityObject.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainObject: User): UserEntity {
    const persistenceEntity = new UserEntity();
    if (domainObject.id && typeof domainObject.id === 'number') {
      persistenceEntity.id = domainObject.id;
    }
    persistenceEntity.email = domainObject.email;
    persistenceEntity.password = domainObject.password;
    persistenceEntity.provider = domainObject.provider;
    persistenceEntity.socialId = domainObject.socialId;
    persistenceEntity.firstName = domainObject.firstName;
    persistenceEntity.lastName = domainObject.lastName;
    persistenceEntity.events = domainObject?.events?.map((event) =>
      EventMapper.toPersistence(event),
    );
    persistenceEntity.role = domainObject.role;
    persistenceEntity.status = domainObject.status;
    persistenceEntity.createdAt = domainObject.createdAt;
    persistenceEntity.updatedAt = domainObject.updatedAt;
    persistenceEntity.deletedAt = domainObject.deletedAt;
    persistenceEntity.groups = domainObject.groups;
    return persistenceEntity;
  }
}
