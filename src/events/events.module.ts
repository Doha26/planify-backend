import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { RelationalEventPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    RelationalEventPersistenceModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, RelationalEventPersistenceModule],
})
export class EventsModule {}
