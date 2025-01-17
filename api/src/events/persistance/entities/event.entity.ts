import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { UserEntity } from '@/users/persistance/entities/user.entity';

export enum EventType {
  PERSONAL = 'personal',
  TEAM = 'team',
  PROJECT = 'project',
}

export enum EventPermission {
  READ_ONLY = 'read_only',
  MODIFY = 'modify',
  DELETE = 'delete',
  READ = 'read',
  ALL = 'all',
}

@Entity({
  name: 'event',
})
export class EventEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @Column({ type: String, nullable: false })
  title: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.PERSONAL,
    nullable: true,
  })
  type?: EventType;

  @ManyToMany(() => UserEntity, (user) => user.events, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'user_events',
    joinColumn: {
      name: 'event_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  participants: UserEntity[];

  @Column({ type: 'jsonb', nullable: true })
  permissions: { [userId: string]: EventPermission[] };

  @Column({ type: String, nullable: true })
  description: string;

  @Column({ type: String, nullable: true })
  location: string;

  @Column({ type: Boolean, default: false, nullable: true })
  isRecurring?: boolean;

  @Column({ type: String, nullable: true })
  recurrencePattern?: string;
}
