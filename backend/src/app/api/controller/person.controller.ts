import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';

@Controller('api/person')
export class PersonController {
  private readonly logger = new Logger(PersonController.name);

  constructor() {
    this.logger.log('starting');
  }

  /**
   * Busca registro
   */
  @Get('/company')
  @UsePipes(new RegisterValidationPipe())
  async findByDocument(@Query() query?: FindCompanyDto): Promise<any> {
    this.logger.log(`Find By Id ${query.cnpj}`);

    return {
      uuid: '11111111-1111-1111-1111-111111111111',
      document: 123123123123,
    };
  }
}
