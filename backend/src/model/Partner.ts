import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Establishment } from './Establishment';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Unique({ properties: ['resourceCountry', 'resource', 'establishment', 'extraKey'] })
export class Partner extends RegisterBaseEntity {
  //hashKey hashtextextended(resource_country_acronym || ':' || (select name from resource r where r.uuid = partner.resource_uuid) || ':' || (select extra_key from establishment e where e.uuid = partner.establishment_uuid) || ':' || extra_key, 1)
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
