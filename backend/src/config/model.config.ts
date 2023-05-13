import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { City } from '../model/Address/City';
import { Country } from '../model/Address/Country';
import { Contact } from '../model/Contact';
import { Establishment } from '../model/Establishment';
import FindPersonByDocument from '../model/Materialized/FindPersonByDocument';
import { Person } from '../model/Person';
import { PersonResource } from '../model/PersonResource';
import { Resource } from '../model/Resource';
import { ResourceCountry } from '../model/ResourceCountry';
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
    City,
    // Base
    ResourceCountry,
    Resource,
    Person,
    PersonResource,
    Establishment,
    Contact,
    // Materialized
    FindPersonByDocument,
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
