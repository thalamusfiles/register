import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Person } from './Person';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Unique({ properties: ['resourceCountry', 'resource', 'person'] })
export class PersonResource extends RegisterBaseEntity {
  //hashId hashtextextended(resource_country_acronym || ':' || (select name from resource r where r.uuid = person_resource.resource_uuid) || ':'  || (select document from person p where p.uuid = person_resource.person_uuid) , 1)

  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @ManyToOne(() => Person, { nullable: false })
  person!: Person;

  @Property({ type: 'json', nullable: false })
  data!: string;

  @Property({ nullable: true })
  deletedAt?: Date;
}
