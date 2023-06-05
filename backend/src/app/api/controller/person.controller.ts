import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@mikro-orm/nestjs';
import FindPersonByDocument from '../../../model/Materialized/FindPersonByDocument';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { Partner } from '../../../model/Partner';
import { Establishment } from '../../../model/Establishment';
import { Person } from '../../../model/Person';

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

    this.knex = (this.findPersonByDocumentRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();
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
      key: `br:cnpj:${query.document.replace(/\./g, '')}`,
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
   * Busca registro de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de sócio da empresa' })
  @Get('/natural')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByDocument(@Query() reqQuery?: FindCompanyDto): Promise<any> {
    this.logger.log(`Find Natural By Document ${reqQuery.document}`);

    let extraKey = reqQuery.document.replace(/[\/.-]*/g, '');
    if (extraKey.length === 11) {
      extraKey = `***${extraKey.substring(3, 9)}**`;
    }

    const partSchemaName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Partner.name).schema;
    const partTableName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Partner.name).tableName;
    const estSchemaName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Establishment.name).schema;
    const estTableName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    const persSchemaName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Person.name).schema;
    const persTableName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Person.name).tableName;

    const query = this.knex
      .select(
        this.knex.raw(
          `(( SELECT (((a.a[1] || '/'::text) || lpad(a.a[2], 4, '0'::text)) || '-'::text) || lpad(a.a[3], 2, '0'::text) FROM regexp_matches(e.extra_key::text, '(.*)/(\\d+)-(.*)'::text) a)) as document`,
        ),
      )
      .select(`pers.name`)
      .select(this.knex.raw(`p.data->>'partner' as partner`))
      .select(this.knex.raw(`p.data->>'partnerDoc' as "partnerDoc"`))
      .select(this.knex.raw(`p.data->>'representativeDoc' as "representativeDoc"`))
      .select(this.knex.raw(`p.data->>'representativeName' as "representativeName"`))
      .from(`${partSchemaName}.${partTableName} as p`)
      .leftJoin(`${estSchemaName}.${estTableName} as e`, `e.uuid`, `p.establishment_uuid`)
      .leftJoin(`${persSchemaName}.${persTableName} as pers`, `pers.uuid`, `e.person_uuid`)
      .where('p.extra_key', extraKey);

    return await query;
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de sócio de empresa' })
  @Get('/natural/random')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalRandom(): Promise<any> {
    this.logger.log(`Find Random Natural`);

    const schemaName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Partner.name).schema;
    const tableName = this.findPersonByDocumentRepo.getEntityManager().getMetadata().get(Partner.name).tableName;
    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('extra_key')
      .from(this.knex.raw(`${schemaName}.${tableName} ${randomize}`))
      .limit(1)
      .first();

    const extraKey = (await query).extra_key;

    return this.findNaturalByDocument({ document: extraKey });
  }
}
