import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from '../Base/RegisterBaseEntity';
import { Resource } from '../Resource';
import { ResourceCountry } from '../ResourceCountry';
import { State } from './State';

@Entity({ schema: 'address', readonly: true })
export class City extends RegisterBaseEntity {
  //hashId hashtextextended(resource_country_acronym || ':' || resource.name || ':' || code, 1)

  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource?: Resource;

  @Property({ nullable: false, length: 16 })
  code!: string;

  @ManyToOne(() => State, { nullable: true })
  state!: State;

  @Check({ expression: 'LENGTH(name) >= 3' })
  @Property({ nullable: false, length: 512 })
  name!: string;
}
