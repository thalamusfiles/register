import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, NestModule } from '@nestjs/common';
import { City } from '../../model/Address/City';
import { State } from '../../model/Address/State';
import { Establishment } from '../../model/Establishment';
import FindPersonByDocument from '../../model/Materialized/FindPersonByDocument';
import { Partner } from '../../model/Partner';
import { Person } from '../../model/Person';
import { ResourceCountry } from '../../model/ResourceCountry';
import { TypeKeyValue } from '../../model/TypeKeyValue';
import { AddressController } from './controller/address.controller';
import { EstablishmentController } from './controller/establishment.controller';

import { PersonController } from './controller/person.controller';
import { TypeKeyValueController } from './controller/typekeyvalue.controller';
import { AddressService } from './service/address.repository';
import { EstablishmentService } from './service/establishment.repository';
import { FindPersonByDocumentService } from './service/findpersonbydocument.repository';
import { PersonService } from './service/person.repository';
import { TypeKeyValueService } from './service/typekeyvalue.repository';

@Module({
  imports: [MikroOrmModule.forFeature([ResourceCountry, FindPersonByDocument, Person, Partner, Establishment, State, City, TypeKeyValue])],
  providers: [FindPersonByDocumentService, PersonService, EstablishmentService, AddressService, TypeKeyValueService],
  controllers: [
    //
    PersonController,
    EstablishmentController,
    AddressController,
    TypeKeyValueController,
  ],
})
export class AppApiModule implements NestModule {
  private readonly logger = new Logger(AppApiModule.name);

  configure() {
    this.logger.log('configure');
  }
}
