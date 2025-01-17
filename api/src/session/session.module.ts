import { forwardRef, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { UserSeedModule } from '@/database/seeds/user/user-seed.module';
import { RelationalSessionPersistenceModule } from './persistance/relational-persistence.module';

// <database-block>
const infrastructurePersistenceModule = RelationalSessionPersistenceModule;

@Module({
  imports: [forwardRef(() => UserSeedModule), infrastructurePersistenceModule],
  providers: [SessionService],
  exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}
