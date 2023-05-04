import { ManyToOne, Property } from '@mikro-orm/core';
import { Person } from '../Person';
import { RegisterBaseEntityWithUser } from './RegisterBaseEntityWithUser';

export abstract class RegisterBaseEntityWithDelete extends RegisterBaseEntityWithUser {
  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Person, { nullable: true })
  deletedBy?: Person;
}
