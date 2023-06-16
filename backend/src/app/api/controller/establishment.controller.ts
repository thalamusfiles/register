import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { BusinessTypeDto, ZipcodeDto, LimitOffsetDto } from './dto/establishment.controller.ts.dto';
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
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais de determinado zipcode' })
  @Get('/zipcode')
  @UsePipes(new RegisterValidationPipe())
  async findByZipcode(@Query() reqQuery?: ZipcodeDto): Promise<any> {
    this.logger.log(`Find By ZipCode ${reqQuery.zipcode}`);

    return this.establishmentService.findByZipcode(reqQuery.zipcode, reqQuery.limit, reqQuery.offset);
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatórios estabelecimentos comerciais de determinado zipcode' })
  @Get('/zipcode/random')
  @UsePipes(new RegisterValidationPipe())
  async findZipcodeRandom(@Query() reqQuery?: LimitOffsetDto): Promise<any> {
    this.logger.log(`Find Random ZipCode`);

    return this.establishmentService.findByZipcodeRandom(reqQuery.limit, reqQuery.offset);
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais pelo tipo de empresa' })
  @Get('/businesstype')
  @UsePipes(new RegisterValidationPipe())
  async findByBusinessType(@Query() reqQuery?: BusinessTypeDto): Promise<any> {
    this.logger.log(`Find By Business Type ${reqQuery.businessType} and  ${reqQuery.cityCode}`);

    return this.establishmentService.findByBusinessType(reqQuery.businessType, reqQuery.cityCode, reqQuery.limit, reqQuery.offset);
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatório de estabelecimentos comerciais pelo tipo de empresa' })
  @Get('/businesstype/random')
  @UsePipes(new RegisterValidationPipe())
  async findByBusinessTypeRandom(@Query() reqQuery?: LimitOffsetDto): Promise<any> {
    this.logger.log(`Find By Random Business Type`);

    return this.establishmentService.findByBusinessTypeRandom(reqQuery.limit, reqQuery.offset);
  }
}
