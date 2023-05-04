import { Module } from '@nestjs/common';
import ModelModule from './model.module';

@Module({
  imports: [
    //
    ModelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
