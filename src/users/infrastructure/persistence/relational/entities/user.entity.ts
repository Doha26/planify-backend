import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { EventEntity } from '@/events/infrastructure/persistence/relational/entities/event.entity';
import { RoleEnum } from '@/utils/shared/roles.enum';
import { StatusEnum } from '@/utils/shared/statuses.enum';

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
  firstName: string;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

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
  deletedAt: Date | null;

  @ManyToMany(() => EventEntity, (event) => event.participants, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_events',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  events: EventEntity[];
}
