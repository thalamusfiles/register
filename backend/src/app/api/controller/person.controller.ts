import { Controller, Get, Logger, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { FindCompanyDto, FindSubsidiaryDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { FindPersonByDocumentService } from '../service/findpersonbydocument.repository';
import { PersonService } from '../service/person.repository';
import productsNames from '../../../config/billing.products';
import { BaseController } from './base.controller';
import { AccessGuard } from 'src/app/auth/passaport/access.guard';
import { RequestInfo } from 'src/commons/request-info';
import { FindSubsidiariesService } from '../service/findsubsidiaries.repository';
import { Throttle } from '@nestjs/throttler';
import { defaultRateTTL, randomRateLimit } from 'src/config/ratelimits';
import { UserThrottlerGuard } from 'src/app/auth/user-throttler.guard';

@UseGuards(UserThrottlerGuard)
@UseGuards(AccessGuard)
@Controller('api/person')
export class PersonController extends BaseController {
  protected readonly logger = new Logger(PersonController.name);

  constructor(
    private readonly findPersonByDocumentService: FindPersonByDocumentService,
    private readonly personService: PersonService,
    private readonly findSubsidiariesService: FindSubsidiariesService,
  ) {
    super();

    this.logger.log('Starting');
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de pessoa jurídica' })
  @Get('/legal')
  @UsePipes(new RegisterValidationPipe())
  async findLegalByDocument(@Query() { document }: FindCompanyDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = await this.findPersonByDocumentService.findLegalByDocument(document);

    return this.logBeforeReturn(resp, `Find Legal By Document`, { product: productsNames.PersonFindLegalByDocument, params: { document } }, user);
  }

  /**
   * Busca registro aleatório de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de pessoa jurídica' })
  @Throttle({ default: { limit: randomRateLimit, ttl: defaultRateTTL } })
  @Get('/legal/random')
  @UsePipes(new RegisterValidationPipe())
  async findLegalByRandom(@Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = await this.findPersonByDocumentService.findLegalRandom();

    return this.logBeforeReturn(resp, `Find Legal By Random`, { product: productsNames.PersonFindLegalByRandom }, user);
  }

  /**
   * Busca registro de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de sócio da empresa' })
  @Get('/natural')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByDocument(@Query() { document }: FindCompanyDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.personService.findPartnerByDocument(document);

    return this.logBeforeReturn(resp, `Find Natural By Document`, { product: productsNames.PersonFindNaturalByDocument, params: { document } }, user);
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de sócio de empresa' })
  @Throttle({ default: { limit: randomRateLimit, ttl: defaultRateTTL } })
  @Get('/natural/random')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByRandom(@Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.personService.findPartnerRandom();

    return this.logBeforeReturn(resp, `Find Natural By Random`, { product: productsNames.PersonFindNaturalByRandom }, user);
  }

  /**
   * Busca filiais a partir do documento da matriz
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de sócio da empresa' })
  @Get('/matrizsubsidiary/corporatecompany')
  @UsePipes(new RegisterValidationPipe())
  async findCorporateCompanyByParentDocument(@Query() { document }: FindSubsidiaryDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.findSubsidiariesService.findSubsidiaryByParentDocument(document);

    return this.logBeforeReturn(
      resp,
      `Find Subsidiary By Parent Document`,
      { product: productsNames.PersonFindCorporateCompanyByParentDocument, params: { document } },
      user,
    );
  }
}
