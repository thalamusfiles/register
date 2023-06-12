import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { AddressService } from '../service/address.repository';
import { FindCitiesByStateDto } from './dto/address.dto';

@Controller('api/address')
export class AddressController {
  private readonly logger = new Logger(AddressController.name);

  constructor(private readonly addressService: AddressService) {
    this.logger.log('starting');
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['States'], summary: 'Coletar registro de estados' })
  @Get('/states')
  @UsePipes(new RegisterValidationPipe())
  async findStates(): Promise<any> {
    this.logger.log(`Find States`);

    return this.addressService.findStates();
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['Cities'], summary: 'Coletar registro de cidades de determinado estado' })
  @Get('/cities')
  @UsePipes(new RegisterValidationPipe())
  async findCitiesByState(@Query() reqQuery?: FindCitiesByStateDto): Promise<any> {
    this.logger.log(`Find Cities By State`);

    return this.addressService.findCitiesByState(reqQuery.stateCode);
  }
}
