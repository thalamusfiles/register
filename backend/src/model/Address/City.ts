import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from '../Base/RegisterBaseEntity';
import { Resource } from '../Resource';
import { ResourceCountry } from '../ResourceCountry';

@Entity({ schema: 'address' })
export class City extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource?: Resource;

  @Check({ expression: 'LENGTH(name) >= 3' })
  @Property({ nullable: false, length: 512 })
  name!: string;
}
