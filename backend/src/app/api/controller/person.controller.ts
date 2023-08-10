import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { FindPersonByDocumentService } from '../service/findpersonbydocument.repository';
import { PersonService } from '../service/person.repository';
import productsNames from '../../../config/billing.products';

@Controller('api/person')
export class PersonController {
  private readonly logger = new Logger(PersonController.name);

  constructor(private readonly findPersonByDocumentService: FindPersonByDocumentService, private readonly personService: PersonService) {
    this.logger.log('Starting');
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de pessoa jurídica' })
  @Get('/legal')
  @UsePipes(new RegisterValidationPipe())
  async findLegalByDocument(@Query() { document }: FindCompanyDto): Promise<any> {
    this.logger.log(`Find Legal By Document`, { product: productsNames.PersonFindLegalByDocument, params: { document } });

    return await this.findPersonByDocumentService.findById(document);
  }

  /**
   * Busca registro aleatório de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de pessoa jurídica' })
  @Get('/legal/random')
  @UsePipes(new RegisterValidationPipe())
  async findLegalByRandom(): Promise<any> {
    this.logger.log(`Find Legal By Random`, { product: productsNames.PersonFindLegalByRandom });

    return await this.findPersonByDocumentService.findLegalRandom();
  }

  /**
   * Busca registro de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de sócio da empresa' })
  @Get('/natural')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByDocument(@Query() { document }: FindCompanyDto): Promise<any> {
    this.logger.log(`Find Natural By Document`, { product: productsNames.PersonFindNaturalByDocument, params: { document } });

    return this.personService.findPartnerByDocument(document);
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de sócio de empresa' })
  @Get('/natural/random')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByRandom(): Promise<any> {
    this.logger.log(`Find Natural By Random`, { product: productsNames.PersonFindNaturalByRandom });

    return this.personService.findPartnerRandom();
  }
}
