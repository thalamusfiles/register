import { ArrayType, Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Person } from './Person';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Index({ properties: ['person'], expression: 'create index contact_person_hash_id_idx on "contact" using hash (person_hash_id)' })
export class Contact extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @ManyToOne(() => Person, { nullable: false })
  person!: Person;

  @Property({ nullable: false })
  extraKey!: string;

  @Property({ type: ArrayType, columnType: 'varchar(64) []', length: 64, nullable: true })
  fax!: string;

  @Property({ type: ArrayType, columnType: 'varchar(64) []', length: 64, nullable: true })
  email!: string;

  @Property({ type: ArrayType, columnType: 'varchar(64) []', length: 64, nullable: true })
  phone!: string[];
}
