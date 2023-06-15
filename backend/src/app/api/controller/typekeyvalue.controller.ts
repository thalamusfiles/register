import { Controller, Get, Logger, UsePipes } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { TypeKeyValueService } from '../service/typekeyvalue.repository';

@Controller('api/keyvalue')
export class TypeKeyValueController {
  private readonly logger = new Logger(TypeKeyValueController.name);

  constructor(private readonly typeKeyValueService: TypeKeyValueService) {
    this.logger.log('starting');
  }

  /**
   * Busca estados
   */
  @ApiOperation({ tags: ['KeyValue'], summary: 'Coletar registro de estados' })
  @Get('/br/cnae')
  @UsePipes(new RegisterValidationPipe())
  async findBRCNAES(): Promise<any> {
    this.logger.log(`Find States`);

    return this.typeKeyValueService.findBRCNAES();
  }
}
