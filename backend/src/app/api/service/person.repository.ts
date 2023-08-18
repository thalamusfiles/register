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

  private readonly partTableName;
  private readonly estTableName;
  private readonly persTableName;

  constructor(
    @InjectRepository(Person)
    private readonly personRepo: EntityRepository<Person>,
  ) {
    this.logger.log('Starting');

    this.knex = (this.personRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();

    this.partTableName = this.personRepo.getEntityManager().getMetadata().get(Partner.name).tableName;
    this.estTableName = this.personRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    this.persTableName = this.personRepo.getEntityManager().getMetadata().get(Person.name).tableName;
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

    const query = this.knex
      .select('e.extra_key as document')
      .select(`pers.name`)
      .select(this.knex.raw(`p.data->>'partner' as partner`))
      .select(this.knex.raw(`p.data->>'partnerDoc' as "partnerDoc"`))
      .select(this.knex.raw(`p.data->>'representativeDoc' as "representativeDoc"`))
      .select(this.knex.raw(`p.data->>'representativeName' as "representativeName"`))
      .from(`${this.partTableName} as p`)
      .leftJoin(`${this.estTableName} as e`, `e.hash_id`, `p.establishment_hash_id`)
      .leftJoin(`${this.persTableName} as pers`, `pers.hash_id`, `e.person_hash_id`)
      .where('p.extra_key', extraKey);

    return await query;
  }

  /**
   * Busca registro de sócios aleatório
   */
  async findPartnerRandom(): Promise<any> {
    this.logger.verbose('findPartnerRandom');

    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('extra_key')
      .from(this.knex.raw(`${this.partTableName} ${randomize}`))
      .limit(1)
      .first();

    const extraKey = (await query).extra_key;

    return this.findPartnerByDocument(extraKey);
  }
}
