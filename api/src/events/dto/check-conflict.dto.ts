import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CheckConflictDTO {
  @ApiProperty({
    description: 'List of user IDs to check for schedule conflicts.',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ message: 'User IDs must not be empty.' })
  userIds: number[];

  @ApiProperty({
    description: 'Proposed start time for the event.',
    example: '2025-01-15T10:00:00.000Z',
  })
  @IsDateString(
    {},
    { message: 'Proposed start time must be a valid ISO date string.' },
  )
  @IsNotEmpty({ message: 'Proposed start time is required.' })
  startTime: Date;

  @ApiProperty({
    description: 'Proposed end time for the event.',
    example: '2025-01-15T12:00:00.000Z',
  })
  @IsDateString(
    {},
    { message: 'Proposed end time must be a valid ISO date string.' },
  )
  @IsNotEmpty({ message: 'Proposed end time is required.' })
  endTime: Date;
}
