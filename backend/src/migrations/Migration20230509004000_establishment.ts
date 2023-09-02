import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "establishment" (
        "hash_id" bigint not null, 
        "created_at" timestamptz(0) not null, 
        "updated_at" timestamptz(0) not null, 
        "resource_country_acronym" varchar(4) not null, 
        "resource_hash_id" bigint not null, 
        "person_hash_id" bigint not null, 
        "extra_key" varchar(255) not null,
        
        "country_hash_id" bigint, 
        "city_hash_id" bigint, 
        "zipcode" varchar(16) null,
        "main_activity" varchar(16) not null,
        "other_activities" varchar(16)[] not null,
        
        "data" jsonb not null, 
        
        constraint "establishment_pkey" primary key ("hash_id")
      );`,
    );

    /**
     * Foreign keys and index
     */

    this.addSql('create index establishment_person_hash_id_idx on "establishment" using hash (person_hash_id);');
    this.addSql('CREATE INDEX establishment_zipcode_idx ON establishment USING hash (zipcode);');
    this.addSql('create index establishment_city_main_activity_idx on "establishment" using btree (city_hash_id, main_activity);');
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "establishment" cascade;`);
  }
}
