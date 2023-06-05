import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Establishment } from '../../../model/Establishment';
import { EntityRepository, Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { ZipcodeDto, ZipcodeRandomDto } from './dto/establishment.controller.ts.dto';
import { Person } from '../../../model/Person';

@Controller('api/establishment')
export class EstablishmentController {
  private readonly logger = new Logger(EstablishmentController.name);
  private readonly knex: Knex;

  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepo: EntityRepository<Establishment>,
  ) {
    this.logger.log('starting');

    this.knex = (this.establishmentRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais' })
  @Get('/zipcode')
  @UsePipes(new RegisterValidationPipe())
  async findByZipcode(@Query() reqQuery?: ZipcodeDto): Promise<any> {
    this.logger.log(`Find By Cep ${reqQuery.zipcode}`);

    const zipcode = reqQuery.zipcode.replace(/[^\d]/g, '');
    const limit = reqQuery.limit > 1000 ? 1000 : reqQuery.limit;
    const offset = reqQuery.offset || 0;

    const estSchemaName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).schema;
    const estTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    const persSchemaName = this.establishmentRepo.getEntityManager().getMetadata().get(Person.name).schema;
    const persTableName = this.establishmentRepo.getEntityManager().getMetadata().get(Person.name).tableName;

    const query = this.knex
      .select('zipcode')
      .select(
        this.knex.raw(
          `(( SELECT (((a.a[1] || '/'::text) || lpad(a.a[2], 4, '0'::text)) || '-'::text) || lpad(a.a[3], 2, '0'::text) FROM regexp_matches(e.extra_key::text, '(.*)/(\\d+)-(.*)'::text) a)) as document`,
        ),
      )
      .select(`pers.name`)
      .from(`${estSchemaName}.${estTableName} as e`)
      .leftJoin(`${persSchemaName}.${persTableName} as pers`, `pers.uuid`, `e.person_uuid`)
      .where('e.zipcode', zipcode)
      .orderBy('pers.name')
      .limit(limit)
      .offset(offset);
    return await query;
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatórios estabelecimentos comerciais' })
  @Get('/zipcode/random')
  @UsePipes(new RegisterValidationPipe())
  async findZipcodeRandom(@Query() reqQuery?: ZipcodeRandomDto): Promise<any> {
    this.logger.log(`Find Random Natural`);

    const schemaName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).schema;
    const tableName = this.establishmentRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('zipcode')
      .from(this.knex.raw(`${schemaName}.${tableName} ${randomize}`))
      .limit(1)
      .first();

    const zipcode = (await query).zipcode;

    return this.findByZipcode({ zipcode, limit: reqQuery.limit, offset: reqQuery.offset });
  }
}
