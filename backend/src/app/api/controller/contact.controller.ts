import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import productsNames from '../../../config/billing.products';
import { ContactDto } from './dto/contact.controller.ts.dto';
import { ContactService } from '../service/contact.repository';

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
    this.logger.log(`Find`, { product: productsNames.ContactFindNaturalByRandom, params: { businessType, cityCode, limit, offset } });

    return this.contactService.findContacts(businessType, cityCode, limit, offset);
  }
}
