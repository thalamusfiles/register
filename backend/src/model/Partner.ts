import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Establishment } from './Establishment';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
export class Partner extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @ManyToOne(() => Establishment, { nullable: false })
  establishment!: Establishment;

  @Property({ nullable: false })
  extraKey!: string;

  @Property({ type: 'json', nullable: false })
  data!: string;
}
