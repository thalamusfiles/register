import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { AddressService } from '../service/address.repository';
import { FindCitiesByStateDto } from './dto/address.dto';
import productsNames from '../../../config/billing.products';
import { BaseController } from './base.controller';

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
  async findStates(): Promise<any> {
    const resp = this.addressService.findStates();

    return this.logBeforeReturn(resp, `Find States`, { product: productsNames.AddressFindStates });
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['Cities'], summary: 'Coletar registro de cidades de determinado estado' })
  @Get('/city')
  @UsePipes(new RegisterValidationPipe())
  async findCitiesByState(@Query() { stateCode, nameLike }: FindCitiesByStateDto): Promise<any> {
    const resp = this.addressService.findCitiesByState(stateCode, nameLike);

    return this.logBeforeReturn(resp, `Find Cities By State`, { product: productsNames.AddressFindCitiesByState, params: { stateCode } });
  }
}
