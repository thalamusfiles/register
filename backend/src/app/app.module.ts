import { Module } from '@nestjs/common';
import { AppApiModule } from './api/appapi.module';
import { RelApiModule } from './api_rel/relapi.module';
import { AuthController } from './auth/controller/auth.controller';
import ModelModule from './model.module';
import { StaticFileModule } from './staticfiles.module';

@Module({
  imports: [
    //
    ModelModule,
    AppApiModule,
    RelApiModule,
    StaticFileModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
