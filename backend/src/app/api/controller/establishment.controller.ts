import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { ZipcodeDto, ZipcodeRandomDto } from './dto/establishment.controller.ts.dto';
import { EstablishmentService } from '../service/establishment.repository';

@Controller('api/establishment')
export class EstablishmentController {
  private readonly logger = new Logger(EstablishmentController.name);

  constructor(private readonly establishmentService: EstablishmentService) {
    this.logger.log('starting');
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais' })
  @Get('/zipcode')
  @UsePipes(new RegisterValidationPipe())
  async findByZipcode(@Query() reqQuery?: ZipcodeDto): Promise<any> {
    this.logger.log(`Find By Cep ${reqQuery.zipcode}`);

    return this.establishmentService.findByZipcode(reqQuery.zipcode, reqQuery.limit, reqQuery.offset);
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatórios estabelecimentos comerciais' })
  @Get('/zipcode/random')
  @UsePipes(new RegisterValidationPipe())
  async findZipcodeRandom(@Query() reqQuery?: ZipcodeRandomDto): Promise<any> {
    this.logger.log(`Find Random Natural`);

    return this.establishmentService.findByZipcodeRandom(reqQuery.limit, reqQuery.offset);
  }
}
