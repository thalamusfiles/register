import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "contact" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_uuid" uuid not null, 
        "person_uuid" uuid not null, 
        "data" jsonb not null, 
        
        constraint "contact_pkey" primary key ("uuid")
      );`,
    );

    this.addSql(
      `alter table "contact" add constraint "contact_resource_country_acronym_foreign"
       foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;`,
    );

    this.addSql(
      `alter table "contact" add constraint "contact_resource_uuid_foreign"
       foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;`,
    );

    this.addSql(
      `alter table "contact" add constraint "contact_person_uuid_foreign"
       foreign key ("person_uuid") references "person" ("uuid") on update cascade;`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`alter table "contact" drop constraint "contact_resource_uuid_foreign";`);

    this.addSql(`alter table "contact" drop constraint "contact_resource_country_acronym_foreign";`);

    this.addSql(`alter table "contact" drop constraint "contact_person_uuid_foreign";`);

    this.addSql(`drop table if exists "contact" cascade;`);
  }
}
