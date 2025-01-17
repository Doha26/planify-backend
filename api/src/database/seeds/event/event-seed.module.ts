import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventSeedService } from './event-seed.service';
import { EventEntity } from '@/events/persistance/entities/event.entity';
import { UserSeedModule } from '../user/user-seed.module';
import { UserEntity } from '@/users/persistance/entities/user.entity';

@Module({
  imports: [
    forwardRef(() => UserSeedModule),
    TypeOrmModule.forFeature([EventEntity, UserEntity]),
  ],
  providers: [EventSeedService],
  exports: [EventSeedService],
})
export class EventSeedModule {}
