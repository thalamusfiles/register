import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { TypeKeyValueService } from '../service/typekeyvalue.repository';
import productsNames from '../../../config/billing.products';
import { FindCnaesDto } from './dto/typekeyvalue.dto';

@Controller('api/keyvalue')
export class TypeKeyValueController {
  private readonly logger = new Logger(TypeKeyValueController.name);

  constructor(private readonly typeKeyValueService: TypeKeyValueService) {
    this.logger.log('Starting');
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['KeyValue'], summary: 'Coletar registro de estados' })
  @Get('/br/cnae')
  @UsePipes(new RegisterValidationPipe())
  async findBRCNAES(@Query() { codeOrDescriptionLike, limit }: FindCnaesDto): Promise<any> {
    this.logger.log(`Find BR CNAES`, { product: productsNames.TypeKeyValueFindBRCNAES, params: { codeOrDescriptionLike } });

    return this.typeKeyValueService.findBRCNAES(codeOrDescriptionLike, limit);
  }
}
