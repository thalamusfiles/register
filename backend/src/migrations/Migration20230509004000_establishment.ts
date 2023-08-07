import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "establishment" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_uuid" uuid not null, 
        "person_uuid" uuid not null, 
        "extra_key" varchar(255) not null,
        
        "country_uuid" uuid, 
        "city_uuid" uuid, 
        "zipcode" varchar(16) null,
        "main_activity" varchar(16) not null,
        "other_activities" varchar(16)[] not null,
        
        "data" jsonb not null, 
        
        constraint "establishment_pkey" primary key ("uuid")
      );`,
    );

    this.addSql(
      `alter table "establishment" add constraint "establishment_resource_country_acronym_resource_uu_d04cc_unique"
       unique ("resource_country_acronym", "resource_uuid", "person_uuid", "extra_key");`,
    );

    /**
     * Foreign keys
     */
  }

  async down(): Promise<void> {

    this.addSql(`drop table if exists "establishment" cascade;`);
  }
}
