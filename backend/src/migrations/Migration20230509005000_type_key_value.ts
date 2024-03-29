import { Migration } from '@mikro-orm/migrations';

export class Migration20230531094013 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "type_key_value" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null, 
        
        "type" varchar(255) not null, 
        "key" varchar(255) not null, 
        "value" jsonb not null, 
        
        "deleted_at" timestamptz(0) null, 
        
        constraint "type_key_value_pkey" primary key ("hash_id"));`,
    );

    this.addSql(
      `alter table "type_key_value" add constraint "type_key_value_resource_country_acronym_resource_h_2777d_unique"
       unique ("resource_country_acronym", "resource_hash_id", "type", "key");`,
    );

    /**
     * Foreign keys
     */
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "type_key_value" cascade;');
  }
}
