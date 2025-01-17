import { UserDomain as User } from '@/users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Session {
  @ApiProperty({
    description:
      'The unique identifier for the user associated with the session.',
    example: 'user-id-123',
  })
  id: number;

  @ApiProperty({
    description: 'The Current User Session',
    example: 'session-token-123',
    type: () => User,
  })
  user: User;

  @ApiProperty({
    description: 'The user session hash',
    example: 'session-token-123',
  })
  hash?: string;

  @ApiProperty({
    description: 'The date of deletion',
    example: 'session-token-123',
  })
  deletedAt?: Date;

  @ApiProperty({
    description: 'The unique session token for the session.',
    example: 'session-token-123',
  })
  sessionToken?: string;

  @ApiProperty({
    description:
      'The unique identifier for the user associated with the session.',
    example: 'user-id-123',
  })
  userId?: number;

  @ApiProperty({
    description: 'The expiration timestamp for the session.',
    example: '2023-01-01T12:00:00Z',
  })
  expires?: Date;

  @ApiProperty({
    description: 'The timestamp when the session was created.',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the session was last updated.',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;
}
