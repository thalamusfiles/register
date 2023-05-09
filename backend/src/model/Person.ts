import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public' })
export class Person extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @Check({ expression: 'LENGTH(name) >= 4' })
  @Property({ nullable: false, length: 512 })
  name!: string;

  @Check({ expression: "personType IN('legal', 'natural')" })
  @Property({ nullable: false, length: 16 })
  personType: string;

  @Property({ nullable: false, length: 16 })
  document_type: string;

  @Property({ nullable: false, length: 255 })
  document: string;

  @Property({ nullable: true })
  deletedAt?: Date;
}
