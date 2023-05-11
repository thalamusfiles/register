import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public' })
export class Resource extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @Check({ expression: 'LENGTH(name) >= 4' })
  @Property({ nullable: false, length: 512 })
  name!: string;

  @Check({ expression: 'LENGTH(description) >= 10' })
  @Property({ nullable: false, length: 512 })
  description!: string;
}
