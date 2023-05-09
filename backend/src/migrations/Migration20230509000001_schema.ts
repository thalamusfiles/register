import { Migration } from '@mikro-orm/migrations';

export class Migration20230210000000_schema extends Migration {
  async up(): Promise<void> {
    this.addSql('create schema if not exists "address";');
  }

  async down(): Promise<void> {
    this.addSql('drop schema "address";');
  }
}
