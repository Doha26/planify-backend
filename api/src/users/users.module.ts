import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '@/events/events.module';
import { AuthModule } from '@/auth/auth.module';
import { RelationalUserPersistenceModule } from './persistance/relational-persistence.module';
import { UserEntity } from './persistance/entities/user.entity';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [
    forwardRef(() => EventsModule),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity]),
    infrastructurePersistenceModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
