import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { Partner } from '../../../model/Partner';
import { Establishment } from '../../../model/Establishment';
import { Person } from '../../../model/Person';

@Injectable()
export class PersonService {
  private readonly logger = new Logger(PersonService.name);
  private readonly knex: Knex;

  constructor(
    @InjectRepository(Person)
    private readonly personRepo: EntityRepository<Person>,
  ) {
    this.logger.log('starting');

    this.knex = (this.personRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();
  }

  /**
   * Busca registro de sócios
   */
  async findPartnerByDocument(document: string): Promise<any> {
    this.logger.verbose('findPartnerByDocument');

    let extraKey = document.replace(/[\/.-]*/g, '');
    if (extraKey.length === 11) {
      extraKey = `***${extraKey.substring(3, 9)}**`;
    }

    const partSchemaName = this.personRepo.getEntityManager().getMetadata().get(Partner.name).schema;
    const partTableName = this.personRepo.getEntityManager().getMetadata().get(Partner.name).tableName;
    const estSchemaName = this.personRepo.getEntityManager().getMetadata().get(Establishment.name).schema;
    const estTableName = this.personRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    const persSchemaName = this.personRepo.getEntityManager().getMetadata().get(Person.name).schema;
    const persTableName = this.personRepo.getEntityManager().getMetadata().get(Person.name).tableName;

    const query = this.knex
      .select('e.extra_key as document')
      .select(`pers.name`)
      .select(this.knex.raw(`p.data->>'partner' as partner`))
      .select(this.knex.raw(`p.data->>'partnerDoc' as "partnerDoc"`))
      .select(this.knex.raw(`p.data->>'representativeDoc' as "representativeDoc"`))
      .select(this.knex.raw(`p.data->>'representativeName' as "representativeName"`))
      .from(`${partSchemaName}.${partTableName} as p`)
      .leftJoin(`${estSchemaName}.${estTableName} as e`, `e.hash_id`, `p.establishment_hash_id`)
      .leftJoin(`${persSchemaName}.${persTableName} as pers`, `pers.hash_id`, `e.person_hash_id`)
      .where('p.extra_key', extraKey);

    return await query;
  }

  /**
   * Busca registro de sócios
   */
  async findPartnerRandom(): Promise<any> {
    this.logger.verbose('findPartnerRandom');

    const schemaName = this.personRepo.getEntityManager().getMetadata().get(Partner.name).schema;
    const tableName = this.personRepo.getEntityManager().getMetadata().get(Partner.name).tableName;
    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('extra_key')
      .from(this.knex.raw(`${schemaName}.${tableName} ${randomize}`))
      .limit(1)
      .first();

    const extraKey = (await query).extra_key;

    return this.findPartnerByDocument(extraKey);
  }
}
