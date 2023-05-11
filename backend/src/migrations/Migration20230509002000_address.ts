import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "address"."country" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_uuid" uuid not null, 
        "code" int not null,
        "name" varchar(512) not null, 
        
        constraint "country_pkey" primary key ("uuid"), 
        constraint country_name_check check (LENGTH(name) >= 3)
      );`,
    );

    this.addSql(
      `create table "address"."city" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_uuid" uuid not null,
        "code" int not null,
        "name" varchar(512) not null, 
        
        constraint "city_pkey" primary key ("uuid"), 
        constraint city_name_check check (LENGTH(name) >= 3)
      );`,
    );

    this.addSql(
      `alter table "address"."country" add constraint "country_resource_country_acronym_foreign"
       foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;`,
    );
    this.addSql(
      `alter table "address"."country" add constraint "country_resource_uuid_foreign"
       foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;`,
    );

    this.addSql(
      `alter table "address"."city" add constraint "city_resource_country_acronym_foreign"
       foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;`,
    );
    this.addSql(
      `alter table "address"."city" add constraint "city_resource_uuid_foreign"
       foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "address"."country" drop constraint "country_resource_uuid_foreign";');

    this.addSql('alter table "address"."city" drop constraint "city_resource_uuid_foreign";');

    this.addSql('alter table "address"."country" drop constraint "country_resource_country_acronym_foreign";');

    this.addSql('alter table "address"."city" drop constraint "city_resource_country_acronym_foreign";');

    this.addSql('drop table if exists "address"."country" cascade;');

    this.addSql('drop table if exists "address"."city" cascade;');
  }
}
