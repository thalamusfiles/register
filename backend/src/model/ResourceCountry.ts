import { PrimaryKey, Check, Entity, Property } from '@mikro-orm/core';

@Entity({ schema: 'public', readonly: true })
export class ResourceCountry {
  @PrimaryKey({ type: 'varchar', length: 4, nullable: false })
  acronym: string;

  @Check({ expression: 'LENGTH(name) >= 3' })
  @Property({ nullable: false, length: 255 })
  name!: string;
}
