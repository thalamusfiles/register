import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { FindCompanyDto } from './dto/person.dto';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { FindPersonByDocumentService } from '../service/findpersonbydocument.repository';
import { PersonService } from '../service/person.repository';

@Controller('api/person')
export class PersonController {
  private readonly logger = new Logger(PersonController.name);

  constructor(private readonly findPersonByDocumentService: FindPersonByDocumentService, private readonly personService: PersonService) {
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

    return await this.findPersonByDocumentService.findById(query.document);
  }

  /**
   * Busca registro aleatório de empresas
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de pessoa jurídica' })
  @Get('/legal/random')
  @UsePipes(new RegisterValidationPipe())
  async findLegalRandom(): Promise<any> {
    this.logger.log(`Find Random Legal`);

    return await this.findPersonByDocumentService.findLegalRandom();
  }

  /**
   * Busca registro de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro de sócio da empresa' })
  @Get('/natural')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalByDocument(@Query() reqQuery?: FindCompanyDto): Promise<any> {
    this.logger.log(`Find Natural By Document ${reqQuery.document}`);

    return this.personService.findPartnerByDocument(reqQuery.document);
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Person'], summary: 'Coletar registro aleatório de sócio de empresa' })
  @Get('/natural/random')
  @UsePipes(new RegisterValidationPipe())
  async findNaturalRandom(): Promise<any> {
    this.logger.log(`Find Random Natural`);

    return this.personService.findPartnerRandom();
  }
}
