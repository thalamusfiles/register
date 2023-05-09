import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Person } from './Person';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public' })
export class PersonResource extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource?: Resource;

  @ManyToOne(() => Person, { nullable: false })
  person?: Person;

  @Property({ nullable: false, length: 512 })
  data!: string;

  @Property({ nullable: true })
  deletedAt?: Date;
}
