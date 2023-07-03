import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { City } from '../model/Address/City';
import { Country } from '../model/Address/Country';
import { State } from '../model/Address/State';
import { Contact } from '../model/Contact';
import { Establishment } from '../model/Establishment';
import FindPersonByDocument from '../model/Materialized/FindPersonByDocument';
import RelEstablishmentByMonthAndMainActivity from '../model/Materialized/RelEstablishmentByMonthAndMainActivity';
import RelEstablishmentByMonthAndNature from '../model/Materialized/RelEstablishmentByMonthAndNature';
import RelEstablishmentByMonthAndState from '../model/Materialized/RelEstablishmentByMonthAndState';
import RelEstablishmentByMonthAndStateCrossTab from '../model/Materialized/RelEstablishmentByMonthAndStateCrossTab';
import { Partner } from '../model/Partner';
import { Person } from '../model/Person';
import { PersonResource } from '../model/PersonResource';
import { Resource } from '../model/Resource';
import { ResourceCountry } from '../model/ResourceCountry';
import { TypeKeyValue } from '../model/TypeKeyValue';
// Carregar neste ordem para não gerar erro de dependência cíclica
//import { User } from '../model/User';
import registerConfig from './register.config';

const defaultModelConfig = {
  host: 'localhost',
  port: 5001,
  dbName: 'register',
  user: 'airflow',
  password: 'airflow',
  charset: 'UTF8',
};

const modelConfig: MikroOrmModuleSyncOptions = {
  migrations: {
    disableForeignKeys: false,
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  entities: [
    // Address
    Country,
    State,
    City,
    // Base
    ResourceCountry,
    Resource,
    Person,
    PersonResource,
    Establishment,
    Contact,
    Partner,
    TypeKeyValue,
    // Materialized
    FindPersonByDocument,
    RelEstablishmentByMonthAndState,
    RelEstablishmentByMonthAndStateCrossTab,
    RelEstablishmentByMonthAndMainActivity,
    RelEstablishmentByMonthAndNature,
  ],
  entitiesTs: ['./src/model'],
  type: 'postgresql',
  host: process.env.DATABASE_HOST || defaultModelConfig.host,
  port: parseInt(process.env.DATABASE_PORT, 10) || defaultModelConfig.port,
  dbName: process.env.DATABASE_NAME || defaultModelConfig.dbName,
  user: process.env.DATABASE_USER || defaultModelConfig.user,
  password: process.env.DATABASE_PASS || defaultModelConfig.password,
  charset: process.env.DATABASE_CHARSET || defaultModelConfig.charset,
  driverOptions: {
    connection: registerConfig.PRODCTION_MODE
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : undefined,
  },
};

export default modelConfig;
