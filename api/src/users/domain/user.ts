import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventDomain as Event } from '@/events/domain/event';
import { RoleEnum } from '@/utils/shared/roles.enum';
import { StatusEnum } from '@/utils/shared/statuses.enum';
import { Session } from '@/session/domain/session';
import { Account } from '@/accounts/domain/account';
import { EventType } from '@/events/domain/event-type';
import { Availability } from './availability';
import { Authenticator } from './authenticator';

export class UserDomain {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null | undefined;

  @ApiProperty({
    type: String,
    example: 'email',
  })
  emailVerified?: Date | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiPropertyOptional({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['admin'] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName?: string;

  @ApiProperty({
    type: String,
    example: 'some-image-url',
  })
  image?: string;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName?: string | null;

  @ApiProperty({
    enum: RoleEnum,
    enumName: 'RoleEnum',
  })
  role: RoleEnum;

  @ApiProperty({
    enum: StatusEnum,
    enumName: 'StatusEnum',
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt?: Date | null;

  @ApiProperty({
    enum: RoleEnum,
    enumName: 'RoleEnum',
  })
  groups: RoleEnum[];

  @ApiProperty({
    type: () => [Event],
  })
  events: Event[];

  @ApiProperty({
    type: () => [Session],
  })
  sessions?: Session[];

  @ApiProperty({
    type: () => [Account],
  })
  accounts?: Account[];

  @ApiProperty({
    type: () => [EventType],
  })
  eventTypes?: EventType[];

  @ApiProperty({
    type: () => [EventType],
  })
  availabilities?: Availability[];

  @ApiProperty({
    type: () => [Authenticator],
  })
  authenticators?: Authenticator[];
}
