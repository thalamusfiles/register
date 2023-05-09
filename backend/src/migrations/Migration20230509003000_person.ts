import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "person" ("uuid" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "resource_country_acronym" varchar(4) not null, "name" varchar(512) not null, "person_type" varchar(16) not null, "document_type" varchar(16) not null, "document" varchar(255) not null, "deleted_at" timestamptz(0) null, constraint "person_pkey" primary key ("uuid"), constraint person_name_check check (LENGTH(name) >= 4), constraint person_person_type_check check (personType IN(\'legal\', \'natural\')));',
    );

    this.addSql(
      'create table "person_resource" ("uuid" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "resource_country_acronym" varchar(4) not null, "resource_uuid" uuid not null, "person_uuid" uuid not null, "data" jsonb not null, "deleted_at" timestamptz(0) null, constraint "person_resource_pkey" primary key ("uuid"));',
    );

    this.addSql(
      'alter table "person" add constraint "person_resource_country_acronym_foreign" foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;',
    );

    this.addSql(
      'alter table "person_resource" add constraint "person_resource_resource_country_acronym_foreign" foreign key ("resource_country_acronym") references "resource_country" ("acronym") on update cascade;',
    );
    this.addSql(
      'alter table "person_resource" add constraint "person_resource_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;',
    );
    this.addSql(
      'alter table "person_resource" add constraint "person_resource_person_uuid_foreign" foreign key ("person_uuid") references "person" ("uuid") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "person_resource" drop constraint "person_resource_resource_uuid_foreign";');

    this.addSql('alter table "person" drop constraint "person_resource_country_acronym_foreign";');

    this.addSql('alter table "person_resource" drop constraint "person_resource_resource_country_acronym_foreign";');

    this.addSql('alter table "person_resource" drop constraint "person_resource_person_uuid_foreign";');

    this.addSql('drop table if exists "person" cascade;');

    this.addSql('drop table if exists "person_resource" cascade;');
  }
}
