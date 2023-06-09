import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {

    // Cria a tabela materializada de estabelecimentos por mes e estado, com dados formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_main_activity as
      select 
        substring(e."data"->>'beginDate', 1, 6) as begin_date, 
        e.main_activity as main_activity, 
        count(e.uuid) as total
      from establishment e
      group by begin_date, main_activity
      order by begin_date desc, total desc;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_main_activity');
  }
}
