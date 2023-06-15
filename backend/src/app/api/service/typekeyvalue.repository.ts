import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { ResourceCountry } from '../../../model/ResourceCountry';
import { TypeKeyValue } from '../../../model/TypeKeyValue';

@Injectable()
export class TypeKeyValueService {
  private readonly logger = new Logger(TypeKeyValueService.name);
  private resourceContry: ResourceCountry;

  constructor(
    @InjectRepository(ResourceCountry)
    private readonly resourceCountry: EntityRepository<ResourceCountry>,
    @InjectRepository(TypeKeyValue)
    private readonly typeKeyValueRepo: EntityRepository<TypeKeyValue>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Busca estados
   */
  async findBRCNAES(): Promise<TypeKeyValue[]> {
    this.logger.verbose('findStates');

    await this.getResourceRef();

    return this.typeKeyValueRepo.find({ resourceCountry: this.resourceContry, type: 'cnae' }, { fields: ['key', 'value'] });
  }

  private async getResourceRef() {
    if (!this.resourceContry) {
      this.resourceContry = await this.resourceCountry.findOneOrFail({ acronym: 'br' });
    }
  }
}
