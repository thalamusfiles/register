import { Controller, Get, Logger, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { AddressService } from '../service/address.repository';
import { FindCitiesByStateDto } from './dto/address.dto';
import productsNames from '../../../config/billing.products';
import { BaseController } from './base.controller';
import { AccessGuard } from 'src/app/auth/passaport/access.guard';
import { RequestInfo } from 'src/commons/request-info';

@UseGuards(AccessGuard)
@Controller('api/address')
export class AddressController extends BaseController {
  protected readonly logger = new Logger(AddressController.name);

  constructor(private readonly addressService: AddressService) {
    super();

    this.logger.log('Starting');
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['States'], summary: 'Coletar registro de estados' })
  @Get('/state')
  @UsePipes(new RegisterValidationPipe())
  async findStates(@Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.addressService.findStates();

    return this.logBeforeReturn(resp, `Find States`, { product: productsNames.AddressFindStates }, user);
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['Cities'], summary: 'Coletar registro de cidades de determinado estado' })
  @Get('/city')
  @UsePipes(new RegisterValidationPipe())
  async findCitiesByState(@Query() { stateCode, nameLike }: FindCitiesByStateDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.addressService.findCitiesByState(stateCode, nameLike);

    return this.logBeforeReturn(resp, `Find Cities By State`, { product: productsNames.AddressFindCitiesByState, params: { stateCode } }, user);
  }
}
