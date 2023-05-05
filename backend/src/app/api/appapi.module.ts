import { Logger, Module, NestModule } from '@nestjs/common';

import { PersonController } from './controller/person.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [
    //
    PersonController,
  ],
})
export class AppApiModule implements NestModule {
  private readonly logger = new Logger(AppApiModule.name);

  configure() {
    this.logger.log('configure');
  }
}
