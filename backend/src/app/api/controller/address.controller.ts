import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { AddressService } from '../service/address.repository';
import { FindCitiesByStateDto } from './dto/address.dto';
import productsNames from '../../../config/billing.products';

@Controller('api/address')
export class AddressController {
  private readonly logger = new Logger(AddressController.name);

  constructor(private readonly addressService: AddressService) {
    this.logger.log('Starting');
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['States'], summary: 'Coletar registro de estados' })
  @Get('/state')
  @UsePipes(new RegisterValidationPipe())
  async findStates(): Promise<any> {
    this.logger.log(`Find States`, { product: productsNames.AddressFindStates });

    return this.addressService.findStates();
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['Cities'], summary: 'Coletar registro de cidades de determinado estado' })
  @Get('/city')
  @UsePipes(new RegisterValidationPipe())
  async findCitiesByState(@Query() { stateCode }: FindCitiesByStateDto): Promise<any> {
    this.logger.log(`Find Cities By State`, { product: productsNames.AddressFindCitiesByState, params: { stateCode } });

    return this.addressService.findCitiesByState(stateCode);
  }
}
