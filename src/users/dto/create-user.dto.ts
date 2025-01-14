import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { RoleEnum } from '@/utils/shared/roles.enum';
import { StatusEnum } from '@/utils/shared/statuses.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String, nullable: false })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null | undefined;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'email', type: String, nullable: true })
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({
    example: '1234567890',
    type: String,
    nullable: true,
    default: null,
  })
  @IsOptional()
  socialId?: string | null;

  @ApiProperty({ example: 'John', type: String, nullable: true })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', type: String, nullable: true })
  @IsNotEmpty()
  lastName: string | null;

  @ApiPropertyOptional({ enum: RoleEnum })
  @IsOptional()
  role?: RoleEnum;

  @ApiPropertyOptional({ enum: StatusEnum })
  @IsOptional()
  status?: StatusEnum;

  @ApiPropertyOptional({ example: ['group1', 'group2'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groups?: string[];

  @ApiPropertyOptional({ example: new Date().toISOString(), type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @ApiPropertyOptional({ example: new Date().toISOString(), type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @ApiPropertyOptional({ example: null, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date | null;

  @ApiPropertyOptional({
    type: [Number],
    example: [1, 2, 3, 4],
  })
  @IsOptional()
  @IsArray()
  events?: number[];
}
