import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';

@Entity({ schema: 'public' })
export class Person extends RegisterBaseEntity {
  @Check({ expression: 'LENGTH(name) >= 4' })
  @Property({ nullable: false, length: 255 })
  name!: string;

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Person, { nullable: true })
  deletedBy?: Person;
}
