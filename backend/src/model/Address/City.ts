import { Check, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { RegisterBaseEntity } from '../Base/RegisterBaseEntity';
import { Resource } from '../Resource';
import { ResourceCountry } from '../ResourceCountry';

@Entity({ schema: 'address', readonly: true })
@Unique({ properties: ['resourceCountry', 'resource', 'code'] })
export class City extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource?: Resource;

  @Property({ type: 'int4', nullable: false })
  code!: number;

  @Check({ expression: 'LENGTH(name) >= 3' })
  @Property({ nullable: false, length: 512 })
  name!: string;
}
