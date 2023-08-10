import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { BusinessTypeDto, ZipcodeDto, LimitOffsetDto } from './dto/establishment.controller.ts.dto';
import { EstablishmentService } from '../service/establishment.repository';
import productsNames from '../../../config/billing.products';

@Controller('api/establishment')
export class EstablishmentController {
  private readonly logger = new Logger(EstablishmentController.name);

  constructor(private readonly establishmentService: EstablishmentService) {
    this.logger.log('Starting');
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais de determinado zipcode' })
  @Get('/zipcode')
  @UsePipes(new RegisterValidationPipe())
  async findByZipcode(@Query() { zipcode, limit, offset }: ZipcodeDto): Promise<any> {
    this.logger.log(`Find By Zipcode ${zipcode}`, { product: productsNames.EstabFindByZipcode, params: { zipcode, limit, offset } });

    return this.establishmentService.findByZipcode(zipcode, limit, offset);
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatórios estabelecimentos comerciais de determinado zipcode' })
  @Get('/zipcode/random')
  @UsePipes(new RegisterValidationPipe())
  async findByZipcodeRandom(@Query() reqQuery?: LimitOffsetDto): Promise<any> {
    this.logger.log(`Find By Zipcode Random`, { product: productsNames.EstabFindByZipcodeRandom });

    return this.establishmentService.findByZipcodeRandom(reqQuery.limit, reqQuery.offset);
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais pelo tipo de empresa' })
  @Get('/businesstype')
  @UsePipes(new RegisterValidationPipe())
  async findByBusinessType(@Query() { businessType, cityCode, limit, offset }: BusinessTypeDto): Promise<any> {
    this.logger.log(`Find By Business Type`, { product: productsNames.EstabFindByBusinessType, params: { businessType, cityCode, limit, offset } });
    this.logger.log(`findByBusinessType ${businessType} and  ${cityCode}`);

    return this.establishmentService.findByBusinessType(businessType, cityCode, limit, offset);
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatório de estabelecimentos comerciais pelo tipo de empresa' })
  @Get('/businesstype/random')
  @UsePipes(new RegisterValidationPipe())
  async findByBusinessTypeRandom(@Query() reqQuery?: LimitOffsetDto): Promise<any> {
    this.logger.log(`Find By Business Type Random`, { product: productsNames.EstabFindByBusinessTypeRandom });

    return this.establishmentService.findByBusinessTypeRandom(reqQuery.limit, reqQuery.offset);
  }
}
