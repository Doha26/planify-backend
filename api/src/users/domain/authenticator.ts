import { ApiProperty } from '@nestjs/swagger';

export class Authenticator {
  @ApiProperty()
  credentialID: string;

  @ApiProperty()
  userId?: number;

  @ApiProperty()
  providerAccountId?: string;

  @ApiProperty()
  credentialPublicKey?: string;

  @ApiProperty({ default: 0 })
  counter?: number;

  @ApiProperty({ nullable: true, default: 'Unknown' })
  credentialDeviceType?: string;

  @ApiProperty({ default: false })
  credentialBackedUp?: boolean;

  @ApiProperty({ nullable: true })
  transports?: string;
}
