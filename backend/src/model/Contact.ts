import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Person } from './Person';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Unique({ properties: ['resourceCountry', 'resource', 'person', 'extraKey'] })
export class Contact extends RegisterBaseEntity {
  //hashId hashtextextended(resource_country_acronym || ':' || (select name from resource r where r.uuid = contact.resource_uuid) || ':' || (select document from person p where p.uuid = contact.person_uuid) || ':' || extra_key, 1)

  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @ManyToOne(() => Person, { nullable: false })
  person!: Person;

  @Property({ nullable: false })
  extraKey!: string;

  @Property({ type: 'json', nullable: false })
  data!: string;
}
