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
        "data" jsonb not null, 
        
        constraint "establishment_pkey" primary key ("uuid")
      );`,
    );

    this.addSql(
      `alter table "establishment" add constraint "establishment_resource_country_acronym_resource_uu_d04cc_unique"
       unique ("resource_country_acronym", "resource_uuid", "person_uuid", "extra_key");`,
    );

    this.addSql(
      `alter table "establishment" add constraint "establishment_resource_country_acronym_foreign"
       foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;`,
    );

    this.addSql(
      `alter table "establishment" add constraint "establishment_resource_uuid_foreign"
       foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;`,
    );

    this.addSql(
      `alter table "establishment" add constraint "establishment_person_uuid_foreign"
       foreign key ("person_uuid") references "person" ("uuid") on update cascade;`,
    );

    this.addSql(
      `alter table "establishment" add constraint "establishment_country_uuid_foreign"
       foreign key ("country_uuid") references "address"."country" ("uuid") on update cascade on delete set null;`,
    );

    this.addSql(
      `alter table "establishment" add constraint "establishment_city_uuid_foreign"
       foreign key ("city_uuid") references "address"."city" ("uuid") on update cascade on delete set null;`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`alter table "establishment" drop constraint "establishment_resource_uuid_foreign";`);

    this.addSql(`alter table "establishment" drop constraint "establishment_resource_country_acronym_foreign";`);

    this.addSql(`alter table "establishment" drop constraint "establishment_person_uuid_foreign";`);

    this.addSql(`alter table "establishment" drop constraint "establishment_country_uuid_foreign";`);

    this.addSql(`alter table "establishment" drop constraint "establishment_city_uuid_foreign";`);

    this.addSql(`drop table if exists "establishment" cascade;`);
  }
}
