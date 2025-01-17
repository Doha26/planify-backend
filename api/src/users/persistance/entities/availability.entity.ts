import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { DayEnum } from '@/utils/days.enum';

@Entity({
  name: 'availability',
})
export class AvailabilityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DayEnum,
  })
  day: DayEnum;

  @Column({ type: 'varchar', length: 5, nullable: true })
  fromTime?: string; // e.g., '08:00'

  @Column({ type: 'varchar', length: 5, nullable: true })
  tillTime?: string; // e.g., '18:00'

  @Column({ default: true, nullable: true })
  isActive?: boolean;

  @ManyToOne(() => UserEntity, (user) => user.availabilities, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
