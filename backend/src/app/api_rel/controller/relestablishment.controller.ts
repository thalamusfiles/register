import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { TotalByMonthAndStateDto } from './dto/relestablishment.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { RelEstablishmentService } from '../service/relestablishment.repository';

@Controller('api/rel/establishment')
export class RelEstablishmentController {
  private readonly logger = new Logger(RelEstablishmentController.name);

  constructor(private readonly relEstablishmentService: RelEstablishmentService) {
    this.logger.log('starting');
  }

  /**
   * Relatório com tótial de empresas por mes e estado
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório totalizador de empresas por mes e estado' })
  @Get('/totalbymonthstate')
  @UsePipes(new RegisterValidationPipe())
  async findTotalByMonthAndState(@Query() query?: TotalByMonthAndStateDto): Promise<any> {
    this.logger.log(`Find Total By Month And State ${query.months}`);

    return await this.relEstablishmentService.totalByMonthAndState(query.months);
  }

  /**
   * Relatório com tótial de empresas por mes e estado
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório totalizador de empresas por mes e estado com dados cruzados' })
  @Get('/totalbymonthstate/crosstab')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndStateCrosstab(@Query() query?: TotalByMonthAndStateDto): Promise<any> {
    this.logger.log(`Find Total By Month And State ${query.months}`);

    return await this.relEstablishmentService.totalByMonthAndStateCrosstab(query.months);
  }
}
