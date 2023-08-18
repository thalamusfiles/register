import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { City } from '../../../model/Address/City';
import { State } from '../../../model/Address/State';
import { ResourceCountry } from '../../../model/ResourceCountry';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);
  private resourceContry: Record<string, ResourceCountry> = {};

  constructor(
    @InjectRepository(ResourceCountry)
    private readonly resourceCountry: EntityRepository<ResourceCountry>,
    @InjectRepository(State)
    private readonly stateRepo: EntityRepository<State>,
    @InjectRepository(City)
    private readonly cityRepo: EntityRepository<City>,
  ) {
    this.logger.log('Starting');
  }

  /**
   * Busca estados
   */
  async findStates(): Promise<State[]> {
    this.logger.verbose('findStates');

    const resourceCountry = await this.getResourceRef('br');

    return this.stateRepo.find({ resourceCountry }, { fields: ['code', 'name'] });
  }

  /**
   * Busca cidades
   */
  async findCitiesByState(stateCode: string, nameLike: string): Promise<City[]> {
    this.logger.verbose('findCitiesByState');

    const where: FilterQuery<City> = {
      resourceCountry: await this.getResourceRef('br'),
    };

    if (stateCode) {
      //where.state = { code: stateCode.toUpperCase() };
    }
    if (nameLike?.replace(/[% ]/g, '').length) {
      where.name = { $like: `%${nameLike.replace(' ', '%').toUpperCase().trim()}%` };
    }

    return this.cityRepo.find(where, { fields: ['code', 'name'], orderBy: { name: 'ASC' } });
  }

  private async getResourceRef(acronym: string) {
    if (!this.resourceContry[acronym]) {
      this.resourceContry[acronym] = await this.resourceCountry.findOneOrFail({ acronym });
    }
    return this.resourceContry[acronym];
  }
}
