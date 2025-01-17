import { UserDomain as User } from '@/users/domain/user';
import { NullableType } from '@/utils/types/nullable.type';
import { Session } from '@/session/domain/session';

export abstract class SessionRepository {
  abstract findById(id: Session['id']): Promise<NullableType<Session>>;

  abstract create(data: Pick<Session, 'user' | 'hash'>): Promise<Session>;

  abstract update(
    id: Session['id'],
    payload: Partial<Pick<Session, 'user' | 'hash'>>,
  ): Promise<Session | null>;

  abstract deleteById(id: Session['id']): Promise<void>;

  abstract deleteByUserId(conditions: { userId: User['id'] }): Promise<void>;

  abstract deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: Session['id'];
  }): Promise<void>;
}
