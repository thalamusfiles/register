import { Check, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { RegisterBaseEntity } from '../Base/RegisterBaseEntity';
import { Resource } from '../Resource';
import { ResourceCountry } from '../ResourceCountry';
import { State } from './State';

@Entity({ schema: 'address', readonly: true })
@Unique({ properties: ['resourceCountry', 'resource', 'code'] })
export class City extends RegisterBaseEntity {
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
