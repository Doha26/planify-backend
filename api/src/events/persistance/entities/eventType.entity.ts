import { UserEntity } from '@/users/persistance/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class EventTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('int', { nullable: true, default: 30 })
  duration?: number;

  @Column('text', { nullable: true })
  url?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('bool', { default: true })
  active?: boolean;

  @Column('text', { default: 'Google Meet', nullable: true })
  videoCallSoftware?: string;

  @ManyToOne(() => UserEntity, (user) => user.eventTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
