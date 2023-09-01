import { Migration } from '@mikro-orm/migrations';

export class Migration20230901114139 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index establishment_city_main_activity_idx on "establishment" using btree (city_hash_id, main_activity);');
    this.addSql('CREATE INDEX establishment_zipcode_idx ON establishment USING hash (zipcode);');

    this.addSql('create index partner_extra_key_idx on "partner" USING hash (extra_key);');
  }

  async down(): Promise<void> {
    this.addSql('drop index "establishment_city_hash_id_main_activity_index";');
    this.addSql('drop index "establishment_zipcode_index";');

    this.addSql('drop index "partner_extra_key_index";');
  }

}
