import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Column,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { UserEntity } from '@/users/persistance/entities/user.entity';

@Entity({
  name: 'session',
})
export class SessionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId?: number;

  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  @Index()
  user: UserEntity;

  @Column('text', { nullable: true })
  hash?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column('text', { nullable: true })
  sessionToken?: string;

  @Column('timestamp', { nullable: true })
  expires?: Date;
}
