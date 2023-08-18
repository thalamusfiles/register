import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { ResourceCountry } from '../../../model/ResourceCountry';
import { TypeKeyValue } from '../../../model/TypeKeyValue';

@Injectable()
export class TypeKeyValueService {
  private readonly logger = new Logger(TypeKeyValueService.name);
  private resourceContry: Record<string, ResourceCountry> = {};

  constructor(
    @InjectRepository(ResourceCountry)
    private readonly resourceCountry: EntityRepository<ResourceCountry>,
    @InjectRepository(TypeKeyValue)
    private readonly typeKeyValueRepo: EntityRepository<TypeKeyValue>,
  ) {
    this.logger.log('Starting');
  }

  /**
   * Busca estados
   */
  async findBRCNAES(codeOrDescriptionLike: string): Promise<TypeKeyValue[]> {
    this.logger.verbose('findStates');

    const whereAnds: FilterQuery<TypeKeyValue> = [{ resourceCountry: await this.getResourceRef('br') }, { type: 'cnae' }];

    if (codeOrDescriptionLike?.replace(/[% ]/g, '').length) {
      whereAnds.push({
        $or: [
          //
          { key: { $like: `%${codeOrDescriptionLike.replace(' ', '%').toUpperCase().trim()}%` } },
          { value: { description: { $ilike: `%${codeOrDescriptionLike.replace(' ', '%').toUpperCase().trim()}%` } } },
        ],
      });
    }

    return this.typeKeyValueRepo.find({ $and: whereAnds }, { fields: ['key', 'value'] });
  }

  private async getResourceRef(acronym: string) {
    if (!this.resourceContry[acronym]) {
      this.resourceContry[acronym] = await this.resourceCountry.findOneOrFail({ acronym });
    }
    return this.resourceContry[acronym];
  }
}
