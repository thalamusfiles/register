import { Migration } from '@mikro-orm/migrations';

export class Migration20230531094013 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "type_key_value" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_uuid" uuid not null, 
        
        "type" varchar(255) not null, 
        "key" varchar(255) not null, 
        "value" jsonb not null, 
        
        "deleted_at" timestamptz(0) null, 
        
        constraint "type_key_value_pkey" primary key ("uuid"));`,
    );
    this.addSql(
      `alter table "type_key_value" add constraint "type_key_value_resource_country_acronym_resource_u_ab2ab_unique"
       unique ("resource_country_acronym", "resource_uuid", "type", "key");`,
    );

    /**
     * Foreign keys
     */
    this.addSql(
      `alter table "type_key_value" add constraint "type_key_value_resource_country_acronym_foreign"
       foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;`,
    );
    this.addSql(
      `alter table "type_key_value" add constraint "type_key_value_resource_uuid_foreign"
       foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "type_key_value" cascade;');
  }
}
