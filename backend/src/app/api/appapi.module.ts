import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, NestModule } from '@nestjs/common';
import FindPersonByDocument from '../../model/Materialized/FindPersonByDocument';
import { Partner } from '../../model/Partner';
import { EstablishmentController } from './controller/establishment.controller';

import { PersonController } from './controller/person.controller';

@Module({
  imports: [MikroOrmModule.forFeature([FindPersonByDocument, Partner])],
  providers: [],
  controllers: [
    //
    PersonController,
    EstablishmentController,
  ],
})
export class AppApiModule implements NestModule {
  private readonly logger = new Logger(AppApiModule.name);

  configure() {
    this.logger.log('configure');
  }
}
