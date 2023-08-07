import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class RegisterBaseEntity {
  @PrimaryKey({ type: 'bigint', nullable: false, autoincrement: false })
  hashId: string;

  //@PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()', nullable: false })
  //uuid: string;
  //@PrimaryKey()
  //uuid: string = v4();

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date;
}
