import { Check, Entity, Property } from '@mikro-orm/core';
import { RegisterBaseEntity } from './Base/RegisterBaseEntity';

@Entity({ schema: 'public' })
export class Resource extends RegisterBaseEntity {
  @Check({ expression: 'LENGTH(name) >= 4' })
  @Property({ nullable: false, length: 512 })
  name!: string;

  @Check({ expression: 'LENGTH(description) >= 10' })
  @Property({ nullable: false, length: 512 })
  description!: string;
}
