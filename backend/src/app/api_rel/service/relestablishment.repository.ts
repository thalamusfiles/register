import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import RelEstablishmentByMonthAndState from '../../../model/Materialized/RelEstablishmentByMonthAndState';
import RelEstablishmentByMonthAndStateCrossTab from '../../../model/Materialized/RelEstablishmentByMonthAndStateCrossTab';

@Injectable()
export class RelEstablishmentService {
  private readonly logger = new Logger(RelEstablishmentService.name);

  constructor(
    @InjectRepository(RelEstablishmentByMonthAndState)
    private readonly relEstablishmentByMonthAndStateRepo: EntityRepository<RelEstablishmentByMonthAndState>,
    @InjectRepository(RelEstablishmentByMonthAndStateCrossTab)
    private readonly relEstablishmentByMonthAndStateCrossTabRepo: EntityRepository<RelEstablishmentByMonthAndStateCrossTab>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Relatório com tótial de empresas por mes e estado
   */
  async totalByMonthAndState(months: Array<string>): Promise<RelEstablishmentByMonthAndState[]> {
    this.logger.verbose('Find Total By Month And State');

    const where: FilterQuery<RelEstablishmentByMonthAndState> = {
      beginDate: { $in: months },
    };

    return await this.relEstablishmentByMonthAndStateRepo.find(where);
  }

  /**
   * Relatório com tótial de empresas por mes e estado, cruzando o mes e o estado
   */
  async totalByMonthAndStateCrosstab(months: Array<string>): Promise<RelEstablishmentByMonthAndStateCrossTab[]> {
    this.logger.verbose('Find Total By Month And State');

    const where: FilterQuery<RelEstablishmentByMonthAndStateCrossTab> = {
      date: { $in: months },
    };

    return await this.relEstablishmentByMonthAndStateCrossTabRepo.find(where);
  }
}
