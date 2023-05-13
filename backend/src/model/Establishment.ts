import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { City } from './Address/City';
import { Country } from './Address/Country';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Person } from './Person';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
export class Establishment extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @ManyToOne(() => Person, { nullable: false })
  person!: Person;

  @ManyToOne(() => Country, { nullable: false })
  country!: Country;

  @ManyToOne(() => City, { nullable: false })
  city!: City;

  @Property({ type: 'json', nullable: false })
  data!: string;
}
