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
        "fax" varchar(64) [] null, 
        "email" varchar(96) [] null, 
        "phone" varchar(64) [] null

        constraint "contact_pkey" primary key ("hash_id")
      );`,
    );

    /**
     * Foreign keys and index
     */

    this.addSql('CREATE INDEX concurrently contact_person_hash_id_idx on "contact" using hash (person_hash_id);');
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "contact" cascade;`);
  }
}
