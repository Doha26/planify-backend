import { Global, Module } from '@nestjs/common';
import { RequestContextService } from './request-context-service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../auth/strategies/jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

@Global() // Makes the module globally available
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        secret: configService.getOrThrow('auth.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.getOrThrow('auth.expires', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    RequestContextService,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [RequestContextService, JwtService],
})
export class RequestContextModule {}
