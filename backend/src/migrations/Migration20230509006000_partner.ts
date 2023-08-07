import { Migration } from '@mikro-orm/migrations';

export class Migration20230602183124 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "partner" (
        "uuid" uuid not null default uuid_generate_v4(), 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_uuid" uuid not null, 
        "establishment_uuid" uuid not null, 
        "extra_key" varchar(255) not null, 
        "data" jsonb not null, 
        
        constraint "partner_pkey" primary key ("uuid"));`,
    );
    this.addSql(
      `alter table "partner" add constraint "partner_resource_country_acronym_resource_uuid_est_38788_unique"
       unique ("resource_country_acronym", "resource_uuid", "establishment_uuid", "extra_key");`,
    );

    /**
     * Foreign keys
     */
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "partner" cascade;');
  }
}
