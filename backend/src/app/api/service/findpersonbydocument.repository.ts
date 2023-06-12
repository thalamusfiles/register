import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import FindPersonByDocument from '../../../model/Materialized/FindPersonByDocument';

@Injectable()
export class FindPersonByDocumentService {
  private readonly logger = new Logger(FindPersonByDocumentService.name);
  private readonly knex: Knex;

  constructor(
    @InjectRepository(FindPersonByDocument)
    private readonly findPersonByDocumentRepo: EntityRepository<FindPersonByDocument>,
  ) {
    this.logger.log('starting');

    this.knex = (this.findPersonByDocumentRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();
  }

  /**
   * Busca registro de empresas
   */
  async findById(document: string): Promise<FindPersonByDocument> {
    this.logger.verbose('Find by Id');

    const where = {
      key: `br:cnpj:${document.replace(/\./g, '')}`,
    };

    return await this.findPersonByDocumentRepo.findOneOrFail(where);
  }

  /**
   * Busca registro aleatório de  empresas
   */
  async findLegalRandom(): Promise<any> {
    this.logger.log(`Find Random Legal`);

    const schemaName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(FindPersonByDocument.name).schema;
    const tableName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(FindPersonByDocument.name).tableName;
    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('*')
      .from(this.knex.raw(`${schemaName}.${tableName} ${randomize}`))
      .limit(1)
      .first();

    return await query;
  }
}
