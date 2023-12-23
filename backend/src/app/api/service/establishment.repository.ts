import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { Establishment } from '../../../model/Establishment';
import { Person } from '../../../model/Person';
import { City } from '../../../model/Address/City';
import { Contact } from 'src/model/Contact';
import { Partner } from 'src/model/Partner';

@Injectable()
export class EstablishmentService {
  private readonly logger = new Logger(EstablishmentService.name);
  private readonly knex: Knex;

  private readonly estTableName;
  private readonly persTableName;
  private readonly contTableName;
  private readonly partTableName;

  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepo: EntityRepository<Establishment>,
    @InjectRepository(City)
    private readonly cityRepo: EntityRepository<City>,
  ) {
    this.logger.log('Starting');

    this.knex = (this.establishmentRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();

    this.estTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    this.persTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Person.name).tableName;
    this.contTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Contact.name).tableName;
    this.partTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Partner.name).tableName;
  }

  /**
   * Busca registro de estabelecimentos por zipcode
   */
  async findByZipcode(zipcode: string, limit: number, offset: number): Promise<any> {
    this.logger.verbose('findByZipcode');

    zipcode = zipcode.replace(/[^\d]/g, '');
    limit = limit > 1000 ? 1000 : limit;
    offset = offset || 0;

    const query = this.knex
      .select('est.extra_key as document')
      .select('est.zipcode')
      .select('est.main_activity')
      .select('est.other_activities')
      .select(`pers.name`)
      .select('cont.phone')
      .select('cont.email')
      .select('cont.fax')
      .select(`part.partner`)
      .select(`part.representative_name`)
      .from(`${this.estTableName} as est`)
      .leftJoin(`${this.persTableName} as pers`, `pers.hash_id`, `est.person_hash_id`)
      .leftJoin(`${this.contTableName} as cont`, `cont.person_hash_id`, `est.person_hash_id`)
      .leftJoin(`${this.partTableName} as part`, `part.establishment_hash_id`, `est.hash_id`)
      .where('est.zipcode', zipcode)
      .orderBy('pers.name')
      .limit(limit)
      .offset(offset);
    return await query;
  }

  /**
   * Busca registro de estabelecimentos por zipcode aleatório
   */
  async findByZipcodeRandom(limit: number, offset: number): Promise<any> {
    this.logger.verbose('findByZipcodeRandom');

    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('zipcode')
      .from(this.knex.raw(`${this.estTableName} ${randomize}`))
      .limit(1)
      .first();

    const zipcode = (await query)?.zipcode;
    if (zipcode) {
      return this.findByZipcode(zipcode, limit, offset);
    }
    throw new NotFoundError('');
  }

  /**
   * Busca registro de estabelecimentos tipo/atividade da empresa
   */
  async findByBusinessType(businessType: string, cityCode: string, limit: number, offset: number): Promise<any[]> {
    this.logger.verbose(`findByBusinessType ${businessType} and ${cityCode}`);

    const city = await this.cityRepo.findOneOrFail({ code: cityCode }, { fields: ['hashId'] });

    limit = limit > 1000 ? 1000 : limit;
    offset = offset || 0;

    const query = this.knex
      .select('e.main_activity')
      .select('e.other_activities')
      .select('e.extra_key as document')
      .select(`pers.name`)
      .from(`${this.estTableName} as e`)
      .leftJoin(`${this.persTableName} as pers`, `pers.hash_id`, `e.person_hash_id`)
      .where('e.city_hash_id', city.hashId)
      .andWhere('e.main_activity', businessType)
      .orderBy('pers.name')
      .limit(limit)
      .offset(offset);

    return await query;
  }

  /**
   * Busca registro de estabelecimentos tipo/atividade da empresa
   */
  async findByBusinessTypeRandom(limit: number, offset: number): Promise<any> {
    this.logger.verbose('findByZipcodeRandom');

    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('main_activity')
      .select(this.knex.raw(`data->>'cityCode' as "cityCode"`))
      .from(this.knex.raw(`${this.estTableName} ${randomize}`))
      .limit(1)
      .first();

    const rs = await query;
    if (rs) {
      const businessType = rs.main_activity;
      const cityCode = rs.cityCode;

      return this.findByBusinessType(businessType, cityCode, limit, offset);
    }
    throw new NotFoundError('');
  }
}
