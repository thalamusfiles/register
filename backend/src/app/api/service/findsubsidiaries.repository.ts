import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import FindSubsidiaries from '../../../model/Materialized/FindSubsidiaries';
import { formatDocumentToSearch } from 'src/commons/hash-id';

@Injectable()
export class FindSubsidiariesService {
  private readonly logger = new Logger(FindSubsidiariesService.name);
  private readonly knex: Knex;

  constructor(
    @InjectRepository(FindSubsidiaries)
    private readonly findSubsidiariesRepo: EntityRepository<FindSubsidiaries>,
  ) {
    this.logger.log('Starting');

    this.knex = (this.findSubsidiariesRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();
  }

  /**
   * Busca registro de empresas
   */
  async findSubsidiaryByParentDocument(parentDoc: string): Promise<Array<FindSubsidiaries>> {
    this.logger.verbose(`Find Subsidiary By Parent Document ${parentDoc}`);

    parentDoc = formatDocumentToSearch('cnpj', parentDoc);
    if (!parentDoc) throw new NotFoundError('');

    return await this.findSubsidiariesRepo.find({ parentDoc: parentDoc }, { filters: { levels: { levels: 1 } } });
  }
}
