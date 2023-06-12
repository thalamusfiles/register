import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, NestModule } from '@nestjs/common';
import { Establishment } from '../../model/Establishment';
import FindPersonByDocument from '../../model/Materialized/FindPersonByDocument';
import { Partner } from '../../model/Partner';
import { Person } from '../../model/Person';
import { EstablishmentController } from './controller/establishment.controller';

import { PersonController } from './controller/person.controller';
import { EstablishmentService } from './service/establishment.repository';
import { FindPersonByDocumentService } from './service/findpersonbydocument.repository';
import { PersonService } from './service/person.repository';

@Module({
  imports: [MikroOrmModule.forFeature([FindPersonByDocument, Person, Partner, Establishment])],
  providers: [FindPersonByDocumentService, PersonService, EstablishmentService],
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
