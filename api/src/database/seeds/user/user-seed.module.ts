import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSeedService } from './user-seed.service';
import { EventSeedModule } from '../event/event-seed.module';
import { EventEntity } from '@/events/persistance/entities/event.entity';
import { SessionModule } from '@/session/session.module';
import { SessionEntity } from '@/session/persistance/entities/session.entity';
import { UserEntity } from '@/users/persistance/entities/user.entity';

@Module({
  imports: [
    forwardRef(() => EventSeedModule),
    forwardRef(() => SessionModule),
    TypeOrmModule.forFeature([UserEntity, EventEntity, SessionEntity]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
