import { ArrayType, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { City } from './Address/City';
import { Country } from './Address/Country';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Person } from './Person';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Unique({ properties: ['resourceCountry', 'resource', 'person', 'extraKey'] })
export class Establishment extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @ManyToOne(() => Person, { nullable: false })
  person!: Person;

  @Property({ nullable: false })
  extraKey!: string;

  @ManyToOne(() => Country, { nullable: true })
  country?: Country;

  @ManyToOne(() => City, { nullable: true })
  city?: City;

  @Property({ nullable: true, length: 16 })
  zipcode?: string;

  @Property({ nullable: false, length: 16 })
  mainActivity?: string;

  @Property({ type: ArrayType, length: 16, nullable: false })
  otherActivities?: string[];

  @Property({ type: 'json', nullable: false })
  data!: string;
}
