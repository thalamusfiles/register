import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@mikro-orm/nestjs';
import FindPersonByDocument from '../../../model/Materialized/FindPersonByDocument';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { Partner } from '../../../model/Partner';

@Controller('api/person')
export class PersonController {
  private readonly logger = new Logger(PersonController.name);
  private readonly knex: Knex;

  constructor(
    @InjectRepository(FindPersonByDocument)
    private readonly findPersonByDocumentRepo: EntityRepository<FindPersonByDocument>,
    @InjectRepository(Partner)
    private readonly partnerRepo: EntityRepository<Partner>,
  ) {
    this.logger.log('starting');

    this.knex = (this.findPersonByDocumentRepo.getEntityManager().getConnection() as PostgreSqlConnection).getKnex();
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

    return await this.findPersonByDocumentRepo.findOneOrFail(where);
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de pessoa jurídica' })
  @Get('/legal/random')
  @UsePipes(new RegisterValidationPipe())
  async findLegalRandom(): Promise<any> {
    this.logger.log(`Find Random Legal`);

    const schemaName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(FindPersonByDocument.name).schema;
    const tableName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(FindPersonByDocument.name).tableName;
    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('*')
      .from(this.knex.raw(`${schemaName}.${tableName} ${randomize}`))
      .limit(1)
      .first();

    return await query;
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
      extraKey: query.document,
    };

    return this.partnerRepo.findOneOrFail(where);
  }
}
