import { ManyToOne } from '@mikro-orm/core';
import { Person } from '../Person';
import { RegisterBaseEntity } from './RegisterBaseEntity';

export abstract class RegisterBaseEntityWithUser extends RegisterBaseEntity {
  @ManyToOne(() => Person, { nullable: false })
  createdBy?: Person;

  @ManyToOne(() => Person, { nullable: false })
  updatedBy?: Person;
}
