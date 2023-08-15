import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Country
    this.addSql(
      `create table "address"."country" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null, 

        "code" varchar(16) not null,
        "name" varchar(512) not null, 
        
        constraint "country_pkey" primary key ("hash_id"), 
        constraint country_name_check check (LENGTH(name) >= 3)
      );`,
    );

    // State
    this.addSql(
      `create table "address"."state" (
        "hash_id" bigint not null,
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null,
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null,
        
        "code" varchar(8) not null, 
        "name" varchar(512) not null, 
        
        constraint "state_pkey" primary key ("hash_id"), 
        constraint state_name_check check (LENGTH(name) >= 2)
      );`,
    );

    // City
    this.addSql(
      `create table "address"."city" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null,
        
        "code" varchar(16) not null,
        "state_hash_id" bigint null,
        "name" varchar(512) not null, 
        
        constraint "city_pkey" primary key ("hash_id"), 
        constraint city_name_check check (LENGTH(name) >= 3)
      );`,
    );

    /**
     * Foreign keys
     */
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "address"."country" cascade;');

    this.addSql('drop table if exists "address"."city" cascade;');
  }
}
