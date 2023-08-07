import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "contact" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null, 
        "person_hash_id" bigint not null, 
        "extra_key" varchar(255) not null,
        "data" jsonb not null, 
        
        constraint "contact_pkey" primary key ("hash_id")
      );`,
    );

    this.addSql(
      `alter table "contact" add constraint "contact_resource_country_acronym_resource_hash_id_per_759d7_unique"
       unique ("resource_country_acronym", "resource_hash_id", "person_hash_id", "extra_key");`,
    );

    /**
     * Foreign keys
     */
  }

  async down(): Promise<void> {

    this.addSql(`drop table if exists "contact" cascade;`);
  }
}
