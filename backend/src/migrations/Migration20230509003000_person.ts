import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "person" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "name" varchar(512) not null, 
        "person_type" varchar(16) not null, 
        "document_type" varchar(16) not null, 
        "document" varchar(255) not null, 
        "deleted_at" timestamptz(0) null, 
        
        constraint "person_pkey" primary key ("hash_id"), 
        constraint person_person_type_check check (person_type IN('legal', 'natural'))
      );`,
    );

    this.addSql(
      `alter table "person" add constraint "person_resource_country_acronym_person_type_docume_61d85_unique"
       unique ("resource_country_acronym", "person_type", "document_type", "document");`,
    );

    this.addSql(
      `create table "person_resource" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null, 
        "person_hash_id" bigint not null, 
        "data" jsonb not null, 
        "deleted_at" timestamptz(0) null, 
        
        constraint "person_resource_pkey" primary key ("hash_id")
      );`,
    );

    this.addSql(
      `alter table "person_resource" add constraint "person_resource_resource_country_acronym_resource__13f13_unique"
       unique ("resource_country_acronym", "resource_hash_id", "person_hash_id");`,
    );

    /**
     * Foreign keys
     */
  }

  async down(): Promise<void> {

    this.addSql(`drop table if exists "person" cascade;`);

    this.addSql(`drop table if exists "person_resource" cascade;`);
  }
}
