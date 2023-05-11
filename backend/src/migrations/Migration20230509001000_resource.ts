import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "resource_country" (
        "acronym" varchar(4) not null, 
        "name" varchar(255) not null, 
        
        constraint "resource_country_pkey" primary key ("acronym"), 
        constraint resource_country_name_check check (LENGTH(name) >= 3));`,
    );

    this.addSql(
      `create table "resource" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null,
        "name" varchar(512) not null,
        "description" varchar(512) not null, 
        
        constraint "resource_pkey" primary key ("uuid"), 
        constraint resource_name_check check (LENGTH(name) >= 4), 
        constraint resource_description_check check (LENGTH(description) >= 10)
      );`,
    );

    this.addSql(
      `alter table "resource" add constraint "resource_resource_country_acronym_foreign"
       foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "resource" drop constraint "resource_resource_country_acronym_foreign";');

    this.addSql('drop table if exists "resource" cascade;');

    this.addSql('drop table if exists "resource_country" cascade;');
  }
}
