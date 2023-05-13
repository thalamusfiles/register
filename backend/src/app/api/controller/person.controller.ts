import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@mikro-orm/nestjs';
import FindPersonByDocument from '../../../model/Materialized/FindPersonByDocument';

@Controller('api/person')
export class PersonController {
  private readonly logger = new Logger(PersonController.name);

  constructor(
    @InjectRepository(FindPersonByDocument)
    private readonly findPersonByDocument: EntityRepository<FindPersonByDocument>,
  ) {
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

    const where = {
      key: `br:cnpj:${query.document.replace(/[^\d]/gi, '')}`,
    };

    return await this.findPersonByDocument.findOne(where);
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de pessoa física' })
  @Get('/natural')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByDocument(@Query() query?: FindCompanyDto): Promise<any> {
    this.logger.log(`Find Natural By Document ${query.document}`);

    const where = {
      key: `br:cpf:${query.document.replace(/[^\d]/gi, '')}`,
    };

    return this.findPersonByDocument.findOne(where);
  }
}
