import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'verification_token',
})
export class VerificationToken {
  @PrimaryColumn()
  identifier: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ type: 'timestamp', nullable: true })
  expires?: Date;
}
