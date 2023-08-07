import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Unique({ properties: ['resourceCountry', 'resource', 'type', 'key'] })
export class TypeKeyValue extends RegisterBaseEntity {
  //hashId hashtextextended( resource_country_acronym || ':' || (select name from resource r where r.uuid = type_key_value.resource_uuid)  || ':' || "type"  || ':' || "value" , 1)

  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @Property({ nullable: false })
  type!: string;

  @Property({ nullable: false })
  key!: string;

  @Property({ type: 'json', nullable: false })
  value!: string;

  @Property({ nullable: true })
  deletedAt?: Date;
}
