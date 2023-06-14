import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { City } from '../../../model/Address/City';
import { State } from '../../../model/Address/State';
import { ResourceCountry } from '../../../model/ResourceCountry';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);
  private resourceContry: ResourceCountry;

  constructor(
    @InjectRepository(ResourceCountry)
    private readonly resourceCountry: EntityRepository<ResourceCountry>,
    @InjectRepository(State)
    private readonly stateRepo: EntityRepository<State>,
    @InjectRepository(City)
    private readonly cityRepo: EntityRepository<City>,
  ) {
    this.logger.log('starting');
  }

  /**
   * Busca estados
   */
  async findStates(): Promise<State[]> {
    this.logger.verbose('findStates');

    await this.getResourceRef();

    return this.stateRepo.find({ resourceCountry: this.resourceContry }, { fields: ['code', 'name'] });
  }

  /**
   * Busca cidades
   */
  async findCitiesByState(stateCode): Promise<City[]> {
    this.logger.verbose('findCitiesByState');

    await this.getResourceRef();

    return this.cityRepo.find({ resourceCountry: this.resourceContry, state: { code: stateCode.toUpperCase() } }, { fields: ['code', 'name'] });
  }

  private async getResourceRef() {
    if (!this.resourceContry) {
      this.resourceContry = await this.resourceCountry.findOneOrFail({ acronym: 'br' });
    }
  }
}
