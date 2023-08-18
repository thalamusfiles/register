import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import productsNames from '../../../config/billing.products';
import { ContactDto } from './dto/contact.controller.ts.dto';
import { ContactService } from '../service/contact.repository';
import { LimitOffsetDto } from './dto/limitoffset.dto';

@Controller('api/contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {
    this.logger.log('Starting');
  }

  /**
   * Busca contatos
   */
  @ApiOperation({ tags: ['Contact'], summary: 'Coletar registros de contatos' })
  @Get('/')
  @UsePipes(new RegisterValidationPipe())
  async find(@Query() { businessType, cityCode, limit, offset }: ContactDto): Promise<any> {
    this.logger.log(`Find`, { product: productsNames.ContactFind, params: { businessType, cityCode, limit, offset } });

    return this.contactService.findContacts(businessType, cityCode, limit, offset);
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Establishment'], summary: 'Coletar registro aleatório de estabelecimentos comerciais pelo tipo de empresa' })
  @Get('/random')
  @UsePipes(new RegisterValidationPipe())
  async findByBusinessTypeRandom(@Query() { limit, offset }: LimitOffsetDto): Promise<any> {
    this.logger.log(`Find Random`, { product: productsNames.ContactFindRandom, params: { limit, offset } });

    return this.contactService.findContactsRandom(limit, offset);
  }
}
