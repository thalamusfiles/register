import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { Establishment } from '../../../model/Establishment';
import { Person } from '../../../model/Person';
import { City } from '../../../model/Address/City';

@Injectable()
export class EstablishmentService {
  private readonly logger = new Logger(EstablishmentService.name);
  private readonly knex: Knex;

  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepo: EntityRepository<Establishment>,
    @InjectRepository(City)
    private readonly cityRepo: EntityRepository<City>,
  ) {
    this.logger.log('starting');

    this.knex = (this.establishmentRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();
  }

  /**
   * Busca registro de sócios
   */
  async findByZipcode(zipcode: string, limit: number, offset: number): Promise<any> {
    this.logger.verbose('findPartnerByDocument');

    zipcode = zipcode.replace(/[^\d]/g, '');
    limit = limit > 1000 ? 1000 : limit;
    offset = offset || 0;

    const estSchemaName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).schema;
    const estTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    const persSchemaName = this.establishmentRepo.getEntityManager().getMetadata().get(Person.name).schema;
    const persTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Person.name).tableName;

    const query = this.knex
      .select('zipcode')
      .select(
        this.knex.raw(
          `(( SELECT (((a.a[1] || '/'::text) || lpad(a.a[2], 4, '0'::text)) || '-'::text) || lpad(a.a[3], 2, '0'::text) FROM regexp_matches(e.extra_key::text, '(.*)/(\\d+)-(.*)'::text) a)) as document`,
        ),
      )
      .select(`pers.name`)
      .from(`${estSchemaName}.${estTableName} as e`)
      .leftJoin(`${persSchemaName}.${persTableName} as pers`, `pers.uuid`, `e.person_uuid`)
      .where('e.zipcode', zipcode)
      .orderBy('pers.name')
      .limit(limit)
      .offset(offset);
    return await query;
  }

  /**
   * Busca registro de sócios
   */
  async findByZipcodeRandom(limit: number, offset: number): Promise<any> {
    this.logger.verbose('findByZipcodeRandom');

    const schemaName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).schema;
    const tableName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('zipcode')
      .from(this.knex.raw(`${schemaName}.${tableName} ${randomize}`))
      .limit(1)
      .first();

    const zipcode = (await query).zipcode;

    return this.findByZipcode(zipcode, limit, offset);
  }

  /**
   * Busca registro de sócios
   */
  async findByBusinessType(businessType: string, cityCode: string, limit: number, offset: number): Promise<any[]> {
    this.logger.verbose('findByBusinessType');

    const city = await this.cityRepo.findOneOrFail({ code: parseInt(cityCode) }, { fields: ['uuid'] });

    limit = limit > 1000 ? 1000 : limit;
    offset = offset || 0;

    const estSchemaName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).schema;
    const estTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    const persSchemaName = this.establishmentRepo.getEntityManager().getMetadata().get(Person.name).schema;
    const persTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Person.name).tableName;

    const query = this.knex
      .select(this.knex.raw("e.data->>'mainActivity' as businesstype"))
      .select(
        this.knex.raw(
          `(( SELECT (((a.a[1] || '/'::text) || lpad(a.a[2], 4, '0'::text)) || '-'::text) || lpad(a.a[3], 2, '0'::text) FROM regexp_matches(e.extra_key::text, '(.*)/(\\d+)-(.*)'::text) a)) as document`,
        ),
      )
      .select(`pers.name`)
      .from(`${estSchemaName}.${estTableName} as e`)
      .leftJoin(`${persSchemaName}.${persTableName} as pers`, `pers.uuid`, `e.person_uuid`)
      //.where('e.city_uuid', city.uuid)
      .andWhere(this.knex.raw("e.data->>'mainActivity' = :businessType", { businessType }))
      .orderBy('pers.name')
      .limit(limit)
      .offset(offset);
    return await query;
  }
}
