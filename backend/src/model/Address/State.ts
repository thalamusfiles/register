import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from '../Base/RegisterBaseEntity';
import { Resource } from '../Resource';
import { ResourceCountry } from '../ResourceCountry';

@Entity({ schema: 'address', readonly: true })
export class State extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource?: Resource;

  @Property({ nullable: false, length: 8 })
  code!: string;

  @Check({ expression: 'LENGTH(name) >= 2' })
  @Property({ nullable: false, length: 512 })
  name!: string;
}
