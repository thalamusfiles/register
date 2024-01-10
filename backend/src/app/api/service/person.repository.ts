import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { Partner } from '../../../model/Partner';
import { Establishment } from '../../../model/Establishment';
import { Person } from '../../../model/Person';
import { establishmentHashIdWhere, formatDocumentToSearch } from 'src/commons/hash-id';

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

    document = document.replace(/[\/.-]*/g, '');

    const isCNPJ = document.length !== 11;
    document = formatDocumentToSearch(isCNPJ ? 'cnpj' : 'cpf', document);

    const query = this.knex
      .select('est.extra_key as document')
      .select(`pers.name`)
      .select(`part.partner`)
      .select(`part.partner_doc`)
      .select(`part.representative_name`)
      .select(`part.representative_doc`)
      .from(`${this.partTableName} as part`)
      .leftJoin(`${this.estTableName} as est`, `est.hash_id`, `part.establishment_hash_id`)
      .leftJoin(`${this.persTableName} as pers`, `pers.hash_id`, `est.person_hash_id`)
      .where('part.extra_key', document);

    if (isCNPJ) {
      this.knex.orWhere('part.', this.knex.raw(establishmentHashIdWhere(document)));
    }

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

    const rs = await query;
    if (rs) {
      return this.findPartnerByDocument(rs.extra_key);
    }
    return null;
  }
}
