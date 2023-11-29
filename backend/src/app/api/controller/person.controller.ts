import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { FindPersonByDocumentService } from '../service/findpersonbydocument.repository';
import { PersonService } from '../service/person.repository';
import productsNames from '../../../config/billing.products';
import { BaseController } from './base.controller';

@Controller('api/person')
export class PersonController extends BaseController {
  protected readonly logger = new Logger(PersonController.name);

  constructor(private readonly findPersonByDocumentService: FindPersonByDocumentService, private readonly personService: PersonService) {
    super();

    this.logger.log('Starting');
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de pessoa jurídica' })
  @Get('/legal')
  @UsePipes(new RegisterValidationPipe())
  async findLegalByDocument(@Query() { document }: FindCompanyDto): Promise<any> {
    const resp = await this.findPersonByDocumentService.findLegalByDocument(document);

    return this.logBeforeReturn(resp, `Find Legal By Document`, { product: productsNames.PersonFindLegalByDocument, params: { document } });
  }

  /**
   * Busca registro aleatório de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de pessoa jurídica' })
  @Get('/legal/random')
  @UsePipes(new RegisterValidationPipe())
  async findLegalByRandom(): Promise<any> {
    const resp = await this.findPersonByDocumentService.findLegalRandom();

    return this.logBeforeReturn(resp, `Find Legal By Random`, { product: productsNames.PersonFindLegalByRandom });
  }

  /**
   * Busca registro de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de sócio da empresa' })
  @Get('/natural')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByDocument(@Query() { document }: FindCompanyDto): Promise<any> {
    const resp = this.personService.findPartnerByDocument(document);

    return this.logBeforeReturn(resp, `Find Natural By Document`, { product: productsNames.PersonFindNaturalByDocument, params: { document } });
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de sócio de empresa' })
  @Get('/natural/random')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByRandom(): Promise<any> {
    const resp = this.personService.findPartnerRandom();

    return this.logBeforeReturn(resp, `Find Natural By Random`, { product: productsNames.PersonFindNaturalByRandom });
  }
}
