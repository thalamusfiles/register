import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/establishment')
export class EstablishmentController {
  private readonly logger = new Logger(EstablishmentController.name);

  constructor() {
    this.logger.log('starting');
  }


  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais' })
  @Get('/legal')
  @UsePipes(new RegisterValidationPipe())
  async findByCep(@Query() query?: FindCompanyDto): Promise<any> {
    this.logger.log(`Find By Cep ${query.document}`);

    return {
      uuid: '11111111-1111-1111-1111-111111111111',
      document: query.document,
    };
  }
}
