import { DayEnum } from '@/utils/days.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserDomain as User } from './user';

export class Availability {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    enum: DayEnum,
    enumName: 'RoleEnum',
  })
  day: DayEnum;

  @ApiProperty()
  fromTime: string; // e.g., '08:00'

  @ApiProperty()
  tillTime: string; // e.g., '18:00'

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({
    type: () => [User],
  })
  user: User;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
