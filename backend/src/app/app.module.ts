import { Module } from '@nestjs/common';
import { AppApiModule } from './api/appapi.module';
import { RelApiModule } from './api_rel/relapi.module';
import { AuthModule } from './auth/auth.module';
import ModelModule from './model.module';
import { StaticFileModule } from './staticfiles.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { defaultRateLimit, defaultRateTTL } from 'src/config/ratelimits';

@Module({
  imports: [
    //
    ThrottlerModule.forRoot([{ ttl: defaultRateTTL, limit: defaultRateLimit }]),
    ModelModule,
    AuthModule,
    AppApiModule,
    RelApiModule,
    StaticFileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
