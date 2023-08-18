import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Person } from './Person';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Index({
  properties: ['person'],
  expression: 'create index person_resource_person_hash_id_idx on "person_resource" using hash (person_hash_id)',
})
export class PersonResource extends RegisterBaseEntity {
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
