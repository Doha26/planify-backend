import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import {
  EventType,
  EventPermission,
} from '@/events/persistance/entities/event.entity';

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

  @IsOptional()
  @IsObject()
  @ApiProperty({
    nullable: true,
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: {
        type: 'string',
        enum: Object.values(EventPermission),
      },
    },
    example: {
      1: ['read_only', 'write'],
      2: ['write'],
    },
  })
  permissions?: { [userId: number]: EventPermission[] };
}
