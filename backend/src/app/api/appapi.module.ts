import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, NestModule } from '@nestjs/common';
import { City } from '../../model/Address/City';
import { State } from '../../model/Address/State';
import { Contact } from '../../model/Contact';
import { Establishment } from '../../model/Establishment';
import FindPersonByDocument from '../../model/Materialized/FindPersonByDocument';
import { Partner } from '../../model/Partner';
import { Person } from '../../model/Person';
import { ResourceCountry } from '../../model/ResourceCountry';
import { TypeKeyValue } from '../../model/TypeKeyValue';
import { AddressController } from './controller/address.controller';
import { ContactController } from './controller/contact.controller';
import { EstablishmentController } from './controller/establishment.controller';

import { PersonController } from './controller/person.controller';
import { TypeKeyValueController } from './controller/typekeyvalue.controller';
import { AddressService } from './service/address.repository';
import { ContactService } from './service/contact.repository';
import { EstablishmentService } from './service/establishment.repository';
import { FindPersonByDocumentService } from './service/findpersonbydocument.repository';
import { PersonService } from './service/person.repository';
import { TypeKeyValueService } from './service/typekeyvalue.repository';

@Module({
  imports: [MikroOrmModule.forFeature([ResourceCountry, State, City, TypeKeyValue, FindPersonByDocument, Person, Partner, Establishment, Contact])],
  providers: [
    //
    FindPersonByDocumentService,
    PersonService,
    EstablishmentService,
    ContactService,
    AddressService,
    TypeKeyValueService,
  ],
  controllers: [
    //
    PersonController,
    EstablishmentController,
    ContactController,
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
