import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Cria a tabela materializada de estabelecimentos por mes e estado, com dados formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_nature as
      select 
        cast(e.begin_date as varchar(6)) as begin_date, 
        nt.hash_id as nature_hash_id,
        count(e.hash_id) filter (where not (pr.is_mei is true or pr."nature_code" in ('2135') or not exists(select 1 from partner where partner.establishment_hash_id = e.hash_id limit 1))) total,
        count(e.hash_id) filter (where pr.is_mei is true or pr."nature_code" in ('2135') or not exists(select 1 from partner where partner.establishment_hash_id = e.hash_id limit 1)) total_mei
      from person_resource pr
      inner join establishment e    on e.person_hash_id = pr.person_hash_id
      inner join type_key_value nt  on nt.hash_id = hashtextextended( 'br:br_gov_dados:nature:' || (pr."nature_code") , 1)
      group by begin_date, nature_hash_id
      order by begin_date desc, total desc;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_nature');
  }
}
