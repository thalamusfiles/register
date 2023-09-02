import { Migration } from '@mikro-orm/migrations';

export class Migration20230602183124 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "partner" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null, 
        "establishment_hash_id" bigint not null, 
        "extra_key" varchar(255) not null, 
        "data" jsonb not null, 
        
        constraint "partner_pkey" primary key ("hash_id"));`,
    );

    /**
     * Foreign keys
     */

    this.addSql('create index partner_establishment_hash_id_idx on "partner" using hash (establishment_hash_id);');
    this.addSql('create index partner_extra_key_idx on "partner" USING hash (extra_key);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "partner" cascade;');
  }
}
