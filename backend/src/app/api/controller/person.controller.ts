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
   * Busca registro
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de pessoa física ou jurídica' })
  @Get('/company')
  @UsePipes(new RegisterValidationPipe())
  async findByDocument(@Query() query?: FindCompanyDto): Promise<any> {
    this.logger.log(`Find By Id ${query.document}`);

    return {
      uuid: '11111111-1111-1111-1111-111111111111',
      document: query.document,
    };
  }
}
