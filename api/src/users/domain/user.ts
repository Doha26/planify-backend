import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventDomain as Event } from '@/events/domain/event';
import { RoleEnum } from '@/utils/shared/roles.enum';
import { StatusEnum } from '@/utils/shared/statuses.enum';

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
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

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
  deletedAt: Date | null;

  @ApiProperty({
    enum: RoleEnum,
    enumName: 'RoleEnum',
  })
  groups: RoleEnum[];

  @ApiProperty({
    type: [Event],
  })
  events: Event[];
}
