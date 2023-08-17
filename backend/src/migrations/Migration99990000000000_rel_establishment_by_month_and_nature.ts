import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Cria a tabela materializada de estabelecimentos por mes e estado, com dados formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_nature as
      select 
        substring(e."data"->>'beginDate', 1, 6) as begin_date, 
        nt."key" as nature_code, 
        nt."value"->>'description' as nature, 
        count(e.hash_id) as total
      from person_resource pr
      inner join establishment e    on e.person_hash_id = pr.person_hash_id
      inner join type_key_value nt  on nt.hash_id = hashtextextended( 'br:br_gov_dados:nature' || (pr."data"->>'natureCode') , 1)
      group by begin_date, nt.hash_id 
      order by begin_date desc, total desc;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_nature');
  }
}
