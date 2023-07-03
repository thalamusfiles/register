import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import RelEstablishmentByMonthAndMainActivity from '../../../model/Materialized/RelEstablishmentByMonthAndMainActivity';
import RelEstablishmentByMonthAndNature from '../../../model/Materialized/RelEstablishmentByMonthAndNature';

@Injectable()
export class RelTypeService {
  private readonly logger = new Logger(RelTypeService.name);

  constructor(
    @InjectRepository(RelEstablishmentByMonthAndNature)
    private readonly relEstablishmentByMonthAndNature: EntityRepository<RelEstablishmentByMonthAndNature>,
    @InjectRepository(RelEstablishmentByMonthAndMainActivity)
    private readonly relEstablishmentByMonthAndActivity: EntityRepository<RelEstablishmentByMonthAndMainActivity>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Relatório com total de empresas por mes e natureza
   */
  async totalByMonthAndNature(months: Array<string>): Promise<RelEstablishmentByMonthAndNature[]> {
    this.logger.verbose('Find Total By Month And Nature');

    const where: FilterQuery<RelEstablishmentByMonthAndNature> = {
      beginDate: { $in: months },
    };

    return await this.relEstablishmentByMonthAndNature.find(where);
  }

  /**
   * Relatório com total de empresas por mes tipo de atividade
   */
  async totalByMonthAndMainActivity(months: Array<string>): Promise<RelEstablishmentByMonthAndMainActivity[]> {
    this.logger.verbose('Find Total By Month And Main Activity');

    const where: FilterQuery<RelEstablishmentByMonthAndMainActivity> = {
      beginDate: { $in: months },
    };

    return await this.relEstablishmentByMonthAndActivity.find(where);
  }
}
