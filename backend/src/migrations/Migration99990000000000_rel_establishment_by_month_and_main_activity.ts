import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Cria a tabela materializada de estabelecimentos por mes e estado, com dados formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_main_activity as
      select
        cast(e.begin_date as varchar(6)) as begin_date, 
        e.main_activity,
        count(e.hash_id) filter (where not (pr.is_mei is true or pr."nature_code" = '2135')) total,
        count(e.hash_id) filter (where pr.is_mei is true or pr."nature_code" = '2135') total_mei
      from establishment e
      left join person_resource pr on pr.person_hash_id = e.person_hash_id
      group by 1, 2
      order by begin_date desc, total desc;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_main_activity');
  }
}
