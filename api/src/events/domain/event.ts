import { ApiProperty } from '@nestjs/swagger';
import {
  EventPermission,
  EventType,
} from '@/events/infrastructure/persistence/relational/entities/event.entity';
import { UserDomain as User } from '@/users/domain/user';

export class EventDomain {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    type: Date,
  })
  startTime: Date;

  @ApiProperty({
    type: Date,
  })
  endTime: Date;

  @ApiProperty({
    enum: EventType,
    enumName: 'EventType',
    default: EventType.PERSONAL,
    nullable: true,
  })
  type: EventType;

  @ApiProperty({
    type: [User],
  })
  participants: User[];

  @ApiProperty({ type: String, nullable: true })
  description: string;

  @ApiProperty({ type: String, nullable: true })
  location: string;

  @ApiProperty({ type: Boolean, default: false })
  isRecurring: boolean;

  @ApiProperty({ type: String, nullable: true })
  recurrencePattern: string;

  @ApiProperty({
    enum: EventPermission,
    enumName: 'EventPermission',
  })
  permissions: { [key: string]: EventPermission[] };
}
