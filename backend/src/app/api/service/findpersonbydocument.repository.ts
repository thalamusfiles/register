import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import FindPersonByDocument from '../../../model/Materialized/FindPersonByDocument';
import { Establishment } from '../../../model/Establishment';

@Injectable()
export class FindPersonByDocumentService {
  private readonly logger = new Logger(FindPersonByDocumentService.name);
  private readonly knex: Knex;

  private readonly cnpjRegex = /(\d{8})(\d{4})(\d{2})/;

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

    document = this.formatDocumentToSearch('cnpj', document);

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

    return this.findLegalByDocument(rs.extra_key);
  }

  formatDocumentToSearch(type: string, document: string): string {
    switch (type) {
      case 'cnpj':
      default:
        const mathces = document.replace(/[\.\/-]/g, '').match(this.cnpjRegex);
        return `${mathces[1]}/${mathces[2]}-${mathces[3]}`;
    }
  }
}
