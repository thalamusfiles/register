import { Check, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';
import { ResourceCountry } from './ResourceCountry';

@Entity({ schema: 'public', readonly: true })
@Unique({ properties: ['resourceCountry', 'personType', 'documentType', 'document'] })
export class Person extends RegisterBaseEntity {
  @ManyToOne(() => ResourceCountry, { nullable: false })
  resourceCountry?: ResourceCountry;

  @Check({ expression: "person_type IN('legal', 'natural')" })
  @Property({ nullable: false, length: 16 })
  personType: string;

  @Property({ nullable: false, length: 16 })
  documentType: string;

  @Property({ nullable: false, length: 255 })
  document: string;

  @Property({ nullable: false, length: 512 })
  name!: string;

  @Property({ nullable: true })
  deletedAt?: Date;
}
