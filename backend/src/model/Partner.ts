import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Establishment } from './Establishment';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Index({ properties: ['establishment'], expression: 'create index partner_establishment_hash_id_idx on "partner" (establishment_hash_id)' })
@Index({ properties: ['extraKey'], expression: 'create index partner_extra_key_idx on "partner" USING hash (extra_key)' })
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
