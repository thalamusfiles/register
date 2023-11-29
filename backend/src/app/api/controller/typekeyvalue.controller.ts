import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { TypeKeyValueService } from '../service/typekeyvalue.repository';
import productsNames from '../../../config/billing.products';
import { FindCnaesDto } from './dto/typekeyvalue.dto';
import { BaseController } from './base.controller';

@Controller('api/keyvalue')
export class TypeKeyValueController extends BaseController {
  protected readonly logger = new Logger(TypeKeyValueController.name);

  constructor(private readonly typeKeyValueService: TypeKeyValueService) {
    super();

    this.logger.log('Starting');
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['KeyValue'], summary: 'Coletar registro de estados' })
  @Get('/br/cnae')
  @UsePipes(new RegisterValidationPipe())
  async findBRCNAES(@Query() { codeOrDescriptionLike, limit }: FindCnaesDto): Promise<any> {
    const resp = this.typeKeyValueService.findBRCNAES(codeOrDescriptionLike, limit);

    return this.logBeforeReturn(resp, `Find BR CNAES`, { product: productsNames.TypeKeyValueFindBRCNAES, params: { codeOrDescriptionLike } });
  }
}
