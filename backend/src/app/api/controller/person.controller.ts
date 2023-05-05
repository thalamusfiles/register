import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/person')
export class PersonController {
  private readonly logger = new Logger(PersonController.name);

  constructor() {
    this.logger.log('starting');
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de pessoa jurídica' })
  @Get('/legal')
  @UsePipes(new RegisterValidationPipe())
  async findLegalByDocument(@Query() query?: FindCompanyDto): Promise<any> {
    this.logger.log(`Find Legal By Document ${query.document}`);

    return {
      uuid: '11111111-1111-1111-1111-111111111111',
      document: query.document,
    };
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de pessoa física' })
  @Get('/natural')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByDocument(@Query() query?: FindCompanyDto): Promise<any> {
    this.logger.log(`Find Natural By Document ${query.document}`);

    return {
      uuid: '11111111-1111-1111-1111-111111111111',
      document: query.document,
    };
  }
}
