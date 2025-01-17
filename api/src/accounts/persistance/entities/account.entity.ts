import { UserEntity } from '@/users/persistance/entities/user.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'account',
})
export class AccountEntity {
  @PrimaryGeneratedColumn()
  userId: string;

  @PrimaryColumn('text')
  type?: string;

  @Column('text', { nullable: true })
  provider?: string;

  @Column('text', { nullable: true })
  providerAccountId?: string;

  @Column({ nullable: true })
  refresh_token?: string;

  @Column({ nullable: true })
  access_token?: string;

  @Column({ nullable: true })
  expires_at?: number;

  @Column({ nullable: true })
  token_type?: string;

  @Column('text', { nullable: true })
  scope?: string;

  @Column({ nullable: true })
  id_token: string;

  @Column({ nullable: true })
  session_state: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
