import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { TotalByMonthAndStateDto, TotalByMonthAndTypeDto } from './dto/relestablishment.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { RelEstablishmentService } from '../service/relestablishment.repository';
import { RelTypeService } from '../service/reltype.repository';

@Controller('api/rel/establishment')
export class RelEstablishmentController {
  private readonly logger = new Logger(RelEstablishmentController.name);

  constructor(private readonly relEstablishmentService: RelEstablishmentService, private readonly relTypeServiceService: RelTypeService) {
    this.logger.log('starting');
  }

  /**
   * Relatório com total de empresas por mes e estado
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório totalizador de empresas por mes e estado' })
  @Get('/totalbymonthstate')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndState(@Query() query?: TotalByMonthAndStateDto): Promise<any> {
    this.logger.log(`totalByMonthAndState ${query.months}`);

    return await this.relEstablishmentService.totalByMonthAndState(query.months);
  }

  /**
   * Relatório com total de empresas por mes e estado
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório totalizador de empresas por mes e estado com dados cruzados' })
  @Get('/totalbymonthstate/crosstab')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndStateCrosstab(@Query() query?: TotalByMonthAndStateDto): Promise<any> {
    this.logger.log(`totalByMonthAndStateCrosstab ${query.months}`);

    return await this.relEstablishmentService.totalByMonthAndStateCrosstab(query.months);
  }

  /**
   * Relatório com total de empresas por mes e natureza
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório com total de empresas por mes e natureza' })
  @Get('/totalbymonthnature')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndNature(@Query() query?: TotalByMonthAndTypeDto): Promise<any> {
    this.logger.log(`totalByMonthAndNature ${query.months}`);

    return await this.relTypeServiceService.totalByMonthAndNature(query.months);
  }

  /**
   * Relatório com total de empresas por mes tipo de atividade
   */
  @ApiOperation({ tags: ['Rel'], summary: 'Relatório com total de empresas por mes tipo de atividade' })
  @Get('/totalbymonthmainactivity')
  @UsePipes(new RegisterValidationPipe())
  async totalByMonthAndMainActivity(@Query() query?: TotalByMonthAndTypeDto): Promise<any> {
    this.logger.log(`totalByMonthAndMainActivity ${query.months}`);

    return await this.relTypeServiceService.totalByMonthAndMainActivity(query.months);
  }
}
