import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { BusinessTypeDto, ZipcodeDto } from './dto/establishment.controller.ts.dto';
import { EstablishmentService } from '../service/establishment.repository';
import productsNames from '../../../config/billing.products';
import { LimitOffsetDto } from './dto/limitoffset.dto';
import { BaseController } from './base.controller';

@Controller('api/establishment')
export class EstablishmentController extends BaseController {
  protected readonly logger = new Logger(EstablishmentController.name);

  constructor(private readonly establishmentService: EstablishmentService) {
    super();

    this.logger.log('Starting');
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais de determinado zipcode' })
  @Get('/zipcode')
  @UsePipes(new RegisterValidationPipe())
  async findByZipcode(@Query() { zipcode, limit, offset }: ZipcodeDto): Promise<any> {
    const resp = this.establishmentService.findByZipcode(zipcode, limit, offset);

    return this.logBeforeReturn(resp, `Find By Zipcode`, { product: productsNames.EstabFindByZipcode, params: { zipcode, limit, offset } });
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatórios estabelecimentos comerciais de determinado zipcode' })
  @Get('/zipcode/random')
  @UsePipes(new RegisterValidationPipe())
  async findByZipcodeRandom(@Query() reqQuery?: LimitOffsetDto): Promise<any> {
    const resp = this.establishmentService.findByZipcodeRandom(reqQuery.limit, reqQuery.offset);

    return this.logBeforeReturn(resp, `Find By Zipcode Random`, { product: productsNames.EstabFindByZipcodeRandom });
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro de estabelecimentos comerciais pelo tipo de empresa' })
  @Get('/businesstype')
  @UsePipes(new RegisterValidationPipe())
  async findByBusinessType(@Query() { businessType, cityCode, limit, offset }: BusinessTypeDto): Promise<any> {
    const resp = this.establishmentService.findByBusinessType(businessType, cityCode, limit, offset);

    return this.logBeforeReturn(resp, `Find By Business Type`, {
      product: productsNames.EstabFindByBusinessType,
      params: { businessType, cityCode, limit, offset },
    });
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatório de estabelecimentos comerciais pelo tipo de empresa' })
  @Get('/businesstype/random')
  @UsePipes(new RegisterValidationPipe())
  async findByBusinessTypeRandom(@Query() { limit, offset }: LimitOffsetDto): Promise<any> {
    const resp = this.establishmentService.findByBusinessTypeRandom(limit, offset);

    return this.logBeforeReturn(resp, `Find By Business Type Random`, {
      product: productsNames.EstabFindByBusinessTypeRandom,
      params: { limit, offset },
    });
  }
}
