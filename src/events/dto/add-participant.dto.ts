import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { EventPermission } from '../infrastructure/persistence/relational/entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ParticipantPermissionDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1, type: Number })
  userId: number;

  @IsEnum(EventPermission, { each: true })
  @IsNotEmpty()
  @ApiProperty({ example: ['read_only', 'modify', 'delete'] })
  permissions: EventPermission[];
}

export class AddParticipantsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: ParticipantPermissionDto,
  })
  participants: ParticipantPermissionDto[];
}
