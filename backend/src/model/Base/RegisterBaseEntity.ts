import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class RegisterBaseEntity {
  @PrimaryKey({ type: 'bigint', nullable: false, autoincrement: false })
  hashId: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date;
}
