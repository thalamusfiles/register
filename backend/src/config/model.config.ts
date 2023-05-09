import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { City } from 'src/model/Address/City';
import { Country } from 'src/model/Address/Country';
import { Contact } from 'src/model/Contact';
import { Establishment } from 'src/model/Establishment';
import { Person } from 'src/model/Person';
import { PersonResource } from 'src/model/PersonResource';
import { Resource } from 'src/model/Resource';
import { ResourceCountry } from 'src/model/ResourceCountry';
// Carregar neste ordem para não gerar erro de dependência cíclica
//import { User } from '../model/User';
import registerConfig from './register.config';

const defaultModelConfig = {
  host: 'localhost',
  port: 5432,
  dbName: 'register',
  user: 'register_user',
  password: 'register_password',
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
