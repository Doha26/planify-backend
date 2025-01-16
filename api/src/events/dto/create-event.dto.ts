import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import {
  EventType,
  EventPermission,
} from '@/events/infrastructure/persistence/relational/entities/event.entity';
import { ParticipantPermissionDto } from './add-participant.dto';

export class CreateEventDto {
  @ApiProperty({ example: 'Team Meeting', type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2025-01-15T10:00:00Z', type: String })
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({ example: '2025-01-15T12:00:00Z', type: String })
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({ example: 'project', enum: EventType })
  @IsNotEmpty()
  type: EventType;

  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsOptional()
  participants?: number[]; // Array of User IDs

  @ApiProperty({ example: 'Project discussion', type: String, nullable: true })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Conference Room 1', type: String, nullable: true })
  @IsOptional()
  location?: string;

  @ApiProperty({ example: false, type: Boolean })
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({ example: 'weekly', type: String, nullable: true })
  @IsOptional()
  recurrencePattern?: string;

  @ApiProperty({
    enum: EventPermission,
    nullable: true,
    example: ['read_only', 'modify', 'delete'],
  })
  @IsOptional()
  @IsObject()
  @ApiProperty({
    type: ParticipantPermissionDto,
  })
  permissions?: { [userId: number]: EventPermission[] };
}
