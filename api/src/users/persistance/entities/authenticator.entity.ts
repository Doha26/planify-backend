import { UserEntity } from './user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('authenticator')
export class AuthenticatorEntity {
  @PrimaryColumn()
  credentialID: string;

  @PrimaryColumn()
  userId: number;

  @Column()
  providerAccountId: string;

  @Column()
  credentialPublicKey: string;

  @Column({ default: 0 })
  counter: number;

  @Column({ nullable: true, default: 'Unknown' })
  credentialDeviceType: string;

  @Column({ default: false })
  credentialBackedUp: boolean;

  @Column({ nullable: true })
  transports?: string;

  @ManyToOne(() => UserEntity, (user) => user.authenticators, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;
}
