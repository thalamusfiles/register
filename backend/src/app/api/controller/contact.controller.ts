import { Controller, Get, Logger, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import productsNames from '../../../config/billing.products';
import { ContactDto } from './dto/contact.controller.ts.dto';
import { ContactService } from '../service/contact.repository';
import { LimitOffsetDto } from './dto/limitoffset.dto';
import { BaseController } from './base.controller';
import { AccessGuard } from 'src/app/auth/passaport/access.guard';
import { RequestInfo } from 'src/commons/request-info';
import { UserThrottlerGuard } from 'src/app/auth/user-throttler.guard';
import { Throttle } from '@nestjs/throttler';
import { defaultRateTTL, randomRateLimit } from 'src/config/ratelimits';

@UseGuards(UserThrottlerGuard)
@UseGuards(AccessGuard)
@Controller('api/contact')
export class ContactController extends BaseController {
  protected readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {
    super();

    this.logger.log('Starting');
  }

  /**
   * Busca contatos
   */
  @ApiOperation({ tags: ['Contact'], summary: 'Coletar registros de contatos' })
  @Get('/')
  @UsePipes(new RegisterValidationPipe())
  async find(@Query() { businessType, cityCode, limit, offset }: ContactDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.contactService.findContacts(businessType, cityCode, limit, offset);

    return this.logBeforeReturn(resp, `Find`, { product: productsNames.ContactFind, params: { businessType, cityCode, limit, offset } }, user);
  }

  /**
   * Busca registro de empresas
   */
  @ApiOperation({ tags: ['Contact'], summary: 'Coletar registro aleatório de contatos' })
  @Throttle({ default: { limit: randomRateLimit, ttl: defaultRateTTL } })
  @Get('/random')
  @UsePipes(new RegisterValidationPipe())
  async findByBusinessTypeRandom(@Query() { limit, offset }: LimitOffsetDto, @Request() request?: RequestInfo): Promise<any> {
    const user = request.user?.sub || null;
    const resp = this.contactService.findContactsRandom(limit, offset);

    return this.logBeforeReturn(resp, `Find Random`, { product: productsNames.ContactFindRandom, params: { limit, offset } }, user);
  }
}
