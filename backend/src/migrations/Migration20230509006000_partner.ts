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
    this.addSql(
      `alter table "partner" add constraint "partner_resource_country_acronym_resource_hash_id_est_38788_unique"
       unique ("resource_country_acronym", "resource_hash_id", "establishment_hash_id", "extra_key");`,
    );

    /**
     * Foreign keys
     */
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "partner" cascade;');
  }
}
