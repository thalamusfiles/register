import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import FindSubsidiaries from '../../../model/Materialized/FindSubsidiaries';
import { formatDocumentToSearch } from 'src/commons/hash-id';
import { Establishment } from 'src/model/Establishment';

@Injectable()
export class FindSubsidiariesService {
  private readonly logger = new Logger(FindSubsidiariesService.name);
  private readonly knex: Knex;

  constructor(
    @InjectRepository(FindSubsidiaries)
    private readonly findSubsidiariesRepo: EntityRepository<FindSubsidiaries>,
    @InjectRepository(Establishment)
    private readonly establishmentRepo: EntityRepository<Establishment>,
  ) {
    this.logger.log('Starting');

    this.knex = (this.findSubsidiariesRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();
  }

  /**
   * Busca registro de empresas filiais ou que possui sociadade
   */
  async findSubsidiaryByParentDocument(parentDoc: string): Promise<Array<FindSubsidiaries>> {
    this.logger.verbose(`Find Subsidiary By Parent Document ${parentDoc}`);

    parentDoc = formatDocumentToSearch('cnpj', parentDoc);
    if (!parentDoc) throw new NotFoundError('');

    const {
      hashId,
      person: { hashId: personHashid },
    } = await this.establishmentRepo.findOne({}, { fields: ['hashId', 'person'], filters: { document: { document: parentDoc } } });

    if (!hashId || !personHashid) {
      return [];
    }

    return await this.findSubsidiariesRepo.find(
      {},
      {
        filters: {
          //
          parent: { hashId, personHashid },
          levels: { levels: 1 },
        },
      },
    );
  }
}
