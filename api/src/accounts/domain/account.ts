import { ApiProperty } from '@nestjs/swagger';

export class Account {
  @ApiProperty({
    description: 'User ID associated with the account',
    example: '1',
  })
  userId: number;

  @ApiProperty({ description: 'Account type', example: 'oauth' })
  type?: string;

  @ApiProperty({ description: 'Provider name', example: 'google' })
  provider?: string;

  @ApiProperty({ description: 'Provider account ID', example: 'google-12345' })
  providerAccountId?: string;

  @ApiProperty({
    description: 'Refresh token for the account',
    example: 'refresh-token-abc123',
    required: false,
  })
  refresh_token?: string;

  @ApiProperty({
    description: 'Access token for the account',
    example: 'access-token-xyz789',
    required: false,
  })
  access_token?: string;

  @ApiProperty({
    description: 'Token expiry timestamp',
    example: 1672531200,
    required: false,
  })
  expires_at?: number;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    required: false,
  })
  token_type?: string;

  @ApiProperty({
    description: 'Scope of the token',
    example: 'email profile',
    required: false,
  })
  scope?: string;

  @ApiProperty({
    description: 'ID token',
    example: 'id-token-123abc',
    required: false,
  })
  id_token?: string;

  @ApiProperty({
    description: 'Session state information',
    example: 'active',
    required: false,
  })
  session_state?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-02T00:00:00Z',
  })
  updatedAt: Date;
}
