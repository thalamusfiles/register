import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import FindPersonByDocument from '../../../model/Materialized/FindPersonByDocument';
import { Establishment } from '../../../model/Establishment';
import { formatDocumentToSearch } from 'src/commons/hash-id';

@Injectable()
export class FindPersonByDocumentService {
  private readonly logger = new Logger(FindPersonByDocumentService.name);
  private readonly knex: Knex;

  constructor(
    @InjectRepository(FindPersonByDocument)
    private readonly findPersonByDocumentRepo: EntityRepository<FindPersonByDocument>,
  ) {
    this.logger.log('Starting');

    this.knex = (this.findPersonByDocumentRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();
  }

  /**
   * Busca registro de empresas
   */
  async findLegalByDocument(document: string): Promise<FindPersonByDocument> {
    this.logger.verbose(`Find legal by document ${document}`);

    document = formatDocumentToSearch('cnpj', document);
    if (!document) throw new NotFoundError('');

    return await this.findPersonByDocumentRepo.findOneOrFail(
      {},
      {
        fields: ['key', 'brGovDados'],
        filters: { document: { document } },
      },
    );
  }

  /**
   * Busca registro aleatório de  empresas
   */
  async findLegalRandom(): Promise<any> {
    this.logger.log(`Find Random Legal`);

    const tableName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('extra_key')
      .from(this.knex.raw(`${tableName} ${randomize}`))
      .limit(1)
      .first();

    const rs = await query;
    if (rs) {
      return this.findLegalByDocument(rs.extra_key);
    }
    throw new NotFoundError('');
  }
}
