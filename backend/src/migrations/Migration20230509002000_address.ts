import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Country
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
      `alter table "address"."country" add constraint "country_resource_country_acronym_resource_uuid_code_unique"
       unique ("resource_country_acronym", "resource_uuid", "code");`,
    );

    this.addSql(
      `alter table "address"."country" add constraint "country_resource_country_acronym_foreign"
       foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;`,
    );
    this.addSql(
      `alter table "address"."country" add constraint "country_resource_uuid_foreign"
       foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;`,
    );

    // State
    this.addSql(
      `create table "address"."state" (
        "uuid" uuid not null default uuid_generate_v4(),
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null,
        "resource_country_acronym" varchar(4) not null, 
        "resource_uuid" uuid not null,
        
        "code" varchar(8) not null, 
        "name" varchar(512) not null, 
        
        constraint "state_pkey" primary key ("uuid"), 
        constraint state_name_check check (LENGTH(name) >= 2)
      );`,
    );

    this.addSql(
      `alter table "address"."state" add constraint "state_resource_country_acronym_resource_uuid_code_unique"
       unique ("resource_country_acronym", "resource_uuid", "code");`,
    );

    // City
    this.addSql(
      `create table "address"."city" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_uuid" uuid not null,
        
        "code" int not null,
        "state_code_uuid" uuid null,
        "name" varchar(512) not null, 
        
        constraint "city_pkey" primary key ("uuid"), 
        constraint city_name_check check (LENGTH(name) >= 3)
      );`,
    );

    this.addSql(
      `alter table "address"."city" add constraint "city_resource_country_acronym_resource_uuid_code_unique"
       unique ("resource_country_acronym", "resource_uuid", "code");`,
    );

    this.addSql(
      `alter table "address"."city" add constraint "city_resource_country_acronym_foreign"
       foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;`,
    );
    this.addSql(
      `alter table "address"."city" add constraint "city_resource_uuid_foreign"
       foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;`,
    );

    this.addSql(
      `alter table "address"."city" add constraint "city_state_code_uuid_foreign"
       foreign key ("state_code_uuid") references "address"."state" ("uuid") on update cascade on delete set null;`,
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
