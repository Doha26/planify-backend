import { forwardRef, Module } from '@nestjs/common';
import { RelationalSessionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SessionService } from './session.service';
import { UserSeedModule } from '@/database/seeds/user/user-seed.module';

// <database-block>
const infrastructurePersistenceModule = RelationalSessionPersistenceModule;

@Module({
  imports: [forwardRef(() => UserSeedModule), infrastructurePersistenceModule],
  providers: [SessionService],
  exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}
