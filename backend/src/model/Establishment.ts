import { ArrayType, Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { City } from './Address/City';
import { Country } from './Address/Country';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { Person } from './Person';
import { Resource } from './Resource';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Index({ properties: ['person'], expression: 'CREATE INDEX establishment_person_hash_id_idx ON "establishment" USING hash (person_hash_id)' })
@Index({ properties: ['zipcode'], expression: 'CREATE INDEX establishment_zipcode_idx ON establishment USING hash (zipcode)' })
@Index({
  properties: ['city', 'mainActivity'],
  expression: 'create index establishment_city_main_activity_idx on "establishment" using btree (city_hash_id, main_activity)',
})
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

  @Property({ nullable: true, length: 256 })
  name: string;

  @Property({ nullable: true, length: 32 })
  number: string;

  @Property({ nullable: true })
  reason: number;

  @Property({ nullable: true })
  status: number;

  @Property({ nullable: true })
  isActive: boolean;

  @Property({ nullable: true })
  beginDate: number;

  @Property({ nullable: true, length: 16 })
  stateCode: string;

  @Property({ nullable: true, length: 256 })
  complement: string;

  @Property({ nullable: true, length: 128 })
  isEspecial: string;

  @Property({ nullable: true })
  statusDate: number;

  @Property({ nullable: true, length: 4 })
  countryCode: string;

  @Property({ nullable: true, length: 256 })
  publicPlace: string;

  @Property({ nullable: true })
  isSubsidiary: boolean;

  @Property({ nullable: true, length: 256 })
  neighborhood: string;

  @Property({ nullable: true })
  isEspecialDate: number;

  @Property({ nullable: true, length: 64 })
  publicPlaceCode: string;
}
