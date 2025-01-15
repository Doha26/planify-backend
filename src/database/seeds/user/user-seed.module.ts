import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSeedService } from './user-seed.service';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { EventSeedModule } from '../event/event-seed.module';
import { EventEntity } from '@/events/infrastructure/persistence/relational/entities/event.entity';
import { SessionEntity } from '@/session/infrastructure/persistence/relational/entities/session.entity';
import { SessionModule } from '@/session/session.module';

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
