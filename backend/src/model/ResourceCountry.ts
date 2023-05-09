import { PrimaryKey, Check, Entity, Property } from '@mikro-orm/core';

@Entity({ schema: 'public' })
export class ResourceCountry {
  @PrimaryKey({ type: 'varchar', length: 4, nullable: false })
  acronym: string;

  @Check({ expression: 'LENGTH(name) >= 3' })
  @Property({ nullable: false, length: 255 })
  name!: string;
}
