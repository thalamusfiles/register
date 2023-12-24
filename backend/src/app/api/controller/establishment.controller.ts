import { Controller, Get, Logger, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { ZipcodeDto } from './dto/establishment.controller.ts.dto';
import { EstablishmentService } from '../service/establishment.repository';
import productsNames from '../../../config/billing.products';
import { LimitOffsetDto } from './dto/limitoffset.dto';
import { BaseController } from './base.controller';
import { AccessGuard } from 'src/app/auth/passaport/access.guard';
import { RequestInfo } from 'src/commons/request-info';

@UseGuards(AccessGuard)
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
  async findByZipcode(@Query() { zipcode, limit, offset }: ZipcodeDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.establishmentService.findByZipcode(zipcode, limit, offset);

    return this.logBeforeReturn(resp, `Find By Zipcode`, { product: productsNames.EstabFindByZipcode, params: { zipcode, limit, offset } }, user);
  }

  /**
   * Busca registro aleatório de sócios
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatórios estabelecimentos comerciais de determinado zipcode' })
  @Get('/zipcode/random')
  @UsePipes(new RegisterValidationPipe())
  async findByZipcodeRandom(@Query() reqQuery?: LimitOffsetDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.establishmentService.findByZipcodeRandom(reqQuery.limit, reqQuery.offset);

    return this.logBeforeReturn(resp, `Find By Zipcode Random`, { product: productsNames.EstabFindByZipcodeRandom }, user);
  }
}
