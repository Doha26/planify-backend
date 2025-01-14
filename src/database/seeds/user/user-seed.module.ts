import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSeedService } from './user-seed.service';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { EventSeedModule } from '../event/event-seed.module';
import { EventEntity } from '@/events/infrastructure/persistence/relational/entities/event.entity';

@Module({
  imports: [
    forwardRef(() => EventSeedModule),
    TypeOrmModule.forFeature([UserEntity, EventEntity]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
