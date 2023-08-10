import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { TotalByMonthAndStateDto, TotalByMonthAndTypeDto } from './dto/relestablishment.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { RelEstablishmentService } from '../service/relestablishment.repository';
import { RelTypeService } from '../service/reltype.repository';
import productsNames from '../../../config/billing.products';

@Controller('api/rel/establishment')
export class RelEstablishmentController {
  private readonly logger = new Logger(RelEstablishmentController.name);

  constructor(private readonly relEstablishmentService: RelEstablishmentService, private readonly relTypeServiceService: RelTypeService) {
    this.logger.log('Starting');
  }

  /**
   * Relatório com total de empresas por mes e estado
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório totalizador de empresas por mes e estado' })
  @Get('/totalbymonthstate')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndState(@Query() { months }: TotalByMonthAndStateDto): Promise<any> {
    this.logger.log(`Total By Month And State`, { product: productsNames.RelEstabTotalByMonthAndState, params: { months } });

    return await this.relEstablishmentService.totalByMonthAndState(months);
  }

  /**
   * Relatório com total de empresas por mes e estado
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório totalizador de empresas por mes e estado com dados cruzados' })
  @Get('/totalbymonthstate/crosstab')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndStateCrosstab(@Query() { months }: TotalByMonthAndStateDto): Promise<any> {
    this.logger.log(`Total By Month And State Crosstab`, { product: productsNames.RelEstabTotalByMonthAndStateCrosstab, params: { months } });

    return await this.relEstablishmentService.totalByMonthAndStateCrosstab(months);
  }

  /**
   * Relatório com total de empresas por mes e natureza
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório com total de empresas por mes e natureza' })
  @Get('/totalbymonthnature')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndNature(@Query() { months }: TotalByMonthAndTypeDto): Promise<any> {
    this.logger.log(`Total By Month And Nature`, { product: productsNames.RelEstabTotalByMonthAndNature, params: { months } });

    return await this.relTypeServiceService.totalByMonthAndNature(months);
  }

  /**
   * Relatório com total de empresas por mes tipo de atividade
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório com total de empresas por mes tipo de atividade' })
  @Get('/totalbymonthmainactivity')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndMainActivity(@Query() { months }: TotalByMonthAndTypeDto): Promise<any> {
    this.logger.log(`Total By Month And Main Activity`, { product: productsNames.RelEstabTotalByMonthAndMainActivity, params: { months } });

    return await this.relTypeServiceService.totalByMonthAndMainActivity(months);
  }
}
