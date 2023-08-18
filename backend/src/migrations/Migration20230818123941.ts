import { Migration } from '@mikro-orm/migrations';

export class Migration20230818123941 extends Migration {
  async up(): Promise<void> {
    this.addSql('create index person_resource_person_hash_id_idx on "person_resource" using hash (person_hash_id);;');
    this.addSql('create index contact_person_hash_id_idx on "contact" using hash (person_hash_id);;');
    this.addSql('create index establishment_person_hash_id_idx on "establishment" using hash (person_hash_id);;');
    this.addSql('create index partner_establishment_hash_id_idx on "partner" using hash (establishment_hash_id);;');
  }

  async down(): Promise<void> {
    this.addSql('drop index "person_resource_person_hash_id_index";');

    this.addSql('drop index "contact_person_hash_id_index";');

    this.addSql('drop index "establishment_person_hash_id_index";');

    this.addSql('drop index "partner_establishment_hash_id_index";');
  }
}
