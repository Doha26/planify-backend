import { ApiProperty } from '@nestjs/swagger';

export class EventType {
  @ApiProperty({
    description: 'Unique identifier for the event type',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'Title of the event type',
    example: 'Team Meeting',
  })
  title: string;

  @ApiProperty({
    description: 'Duration of the event in minutes',
    example: 60,
  })
  duration?: number;

  @ApiProperty({
    description: 'URL for the event, such as a video conferencing link',
    example: 'https://meet.google.com/xyz-abc-pqr',
  })
  url?: string;

  @ApiProperty({
    description: 'Detailed description of the event',
    example: 'A meeting to discuss quarterly goals and updates',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Indicates whether the event is active',
    example: true,
    default: true,
  })
  active?: boolean;

  @ApiProperty({
    description: 'Software used for video calls',
    example: 'Google Meet',
    default: 'Google Meet',
  })
  videoCallSoftware?: string;

  @ApiProperty({
    description: 'The ID of the user who created the event',
    example: 'user-12345',
  })
  userId?: string;

  @ApiProperty({
    description: 'Timestamp when the event type was created',
    example: '2025-01-17T12:34:56.789Z',
  })
  createdAt: Date;
}
