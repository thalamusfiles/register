import { Controller, Get, Logger, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { TotalByMonthAndStateDto, TotalByMonthAndTypeDto } from './dto/relestablishment.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { RelEstablishmentService } from '../service/relestablishment.repository';
import { RelTypeService } from '../service/reltype.repository';
import productsNames from '../../../config/billing.products';
import { BaseController } from 'src/app/api/controller/base.controller';
import { AccessGuard } from 'src/app/auth/passaport/access.guard';
import { RequestInfo } from 'src/commons/request-info';

@UseGuards(AccessGuard)
@Controller('api/rel/establishment')
export class RelEstablishmentController extends BaseController {
  protected readonly logger = new Logger(RelEstablishmentController.name);

  constructor(private readonly relEstablishmentService: RelEstablishmentService, private readonly relTypeServiceService: RelTypeService) {
    super();

    this.logger.log('Starting');
  }

  /**
   * Relatório com total de empresas por mes e estado
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório totalizador de empresas por mes e estado' })
  @Get('/totalbymonthstate')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndState(@Query() { months }: TotalByMonthAndStateDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = await this.relEstablishmentService.totalByMonthAndState(months);

    return this.logBeforeReturn(resp, `Total By Month And State`, { product: productsNames.RelEstabTotalByMonthAndState, params: { months } }, user);
  }

  /**
   * Relatório com total de empresas por mes e estado
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório totalizador de empresas por mes e estado com dados cruzados' })
  @Get('/totalbymonthstate/crosstab')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndStateCrosstab(@Query() { months }: TotalByMonthAndStateDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = await this.relEstablishmentService.totalByMonthAndStateCrosstab(months);

    return this.logBeforeReturn(
      resp,
      `Total By Month And State Crosstab`,
      {
        product: productsNames.RelEstabTotalByMonthAndStateCrosstab,
        params: { months },
      },
      user,
    );
  }

  /**
   * Relatório com total de empresas por mes e natureza
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório com total de empresas por mes e natureza' })
  @Get('/totalbymonthnature')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndNature(@Query() { months }: TotalByMonthAndTypeDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = await this.relTypeServiceService.totalByMonthAndNature(months);

    return this.logBeforeReturn(
      resp,
      `Total By Month And Nature`,
      { product: productsNames.RelEstabTotalByMonthAndNature, params: { months } },
      user,
    );
  }

  /**
   * Relatório com total de empresas por mes tipo de atividade
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório com total de empresas por mes tipo de atividade' })
  @Get('/totalbymonthmainactivity')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndMainActivity(@Query() { months }: TotalByMonthAndTypeDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = await this.relTypeServiceService.totalByMonthAndMainActivity(months);

    return this.logBeforeReturn(
      resp,
      `Total By Month And Main Activity`,
      {
        product: productsNames.RelEstabTotalByMonthAndMainActivity,
        params: { months },
      },
      user,
    );
  }
}
