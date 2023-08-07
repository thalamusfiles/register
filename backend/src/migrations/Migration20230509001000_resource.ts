import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "resource_country" (
        "acronym" varchar(4) not null, 
        "name" varchar(255) not null, 
        
        constraint "resource_country_pkey" primary key ("acronym"), 
        constraint resource_country_name_check check (LENGTH(name) >= 3));`,
    );

    this.addSql(
      `create table "resource" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null,
        "name" varchar(512) not null,
        "description" varchar(512) not null, 
        
        constraint "resource_pkey" primary key ("hash_id"), 
        constraint resource_name_check check (LENGTH(name) >= 4), 
        constraint resource_description_check check (LENGTH(description) >= 10)
      );`,
    );

    /**
     * Foreign keys
     */
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "resource" cascade;');

    this.addSql('drop table if exists "resource_country" cascade;');
  }
}
