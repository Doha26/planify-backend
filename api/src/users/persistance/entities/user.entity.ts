import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { EventEntity } from '@/events/persistance/entities/event.entity';
import { RoleEnum } from '@/utils/shared/roles.enum';
import { StatusEnum } from '@/utils/shared/statuses.enum';
import { SessionEntity } from '@/session/persistance/entities/session.entity';
import { AccountEntity } from '@/accounts/persistance/entities/account.entity';
import { EventTypeEntity } from '@/events/persistance/entities/eventType.entity';
import { AvailabilityEntity } from './availability.entity';
import { AuthenticatorEntity } from './authenticator.entity';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  email: string | null | undefined;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName?: string;

  @Index()
  @Column({ type: String, nullable: true })
  lastName?: string | null;

  @Column({ nullable: true })
  emailVerified?: Date;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.INACTIVE })
  status: StatusEnum;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  groups: RoleEnum[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @ManyToMany(() => EventEntity, (event) => event.participants, {
    onDelete: 'CASCADE',
  })
  events: EventEntity[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts: AccountEntity[];

  @OneToMany(() => EventTypeEntity, (eventType) => eventType.user, {
    cascade: ['insert', 'update'],
  })
  eventTypes: EventTypeEntity[];

  @OneToMany(() => AvailabilityEntity, (availability) => availability.user, {
    cascade: true,
  })
  availabilities: AvailabilityEntity[];

  @OneToMany(() => AuthenticatorEntity, (authenticator) => authenticator.user)
  authenticators: AuthenticatorEntity[];
}
