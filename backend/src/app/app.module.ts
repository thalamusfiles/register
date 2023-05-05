import { Module } from '@nestjs/common';
import { AppApiModule } from './api/appapi.module';
import ModelModule from './model.module';
import { StaticFileModule } from './staticfiles.module';

@Module({
  imports: [
    //
    ModelModule,
    AppApiModule,
    StaticFileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
