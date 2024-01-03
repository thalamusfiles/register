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
      `create table "person_resource" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null, 
        "person_hash_id" bigint not null, 
        "deleted_at" timestamptz(0) null, 
        "ente" varchar(64) null, 
        "capital" numeric(15,3) null, 
        "size_code" int null, 
        "nature_code" int null, 
        "qualification_code" int null,
        "is_simple" boolean null,
        "simple_created_at" int null,
        "simple_deleted_at" int null, 
        "is_mei" boolean null,
        "mei_created_at" int null, 
        "mei_deleted_at" int null, 

        constraint "person_resource_pkey" primary key ("hash_id")
      );`,
    );

    /**
     * Foreign keys and index
     */

    this.addSql('create index person_resource_person_hash_id_idx on "person_resource" using hash (person_hash_id);');
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "person_resource" cascade;`);

    this.addSql(`drop table if exists "person" cascade;`);
  }
}
