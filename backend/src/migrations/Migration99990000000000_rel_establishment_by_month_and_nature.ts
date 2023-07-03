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
        count(e.uuid) as total
      from person_resource pr cross join resource r
      inner join establishment e    on e.resource_country_acronym = 'br'  and e.resource_uuid = r.uuid  and e.person_uuid = pr.person_uuid
      inner join type_key_value nt  on nt.resource_country_acronym = 'br' and nt.resource_uuid = r.uuid and nt."type" = 'nature' and nt.key = pr."data"->>'natureCode'
      where r."name" = 'br_gov_dados'
      group by begin_date, nt.uuid 
      order by begin_date desc, total desc;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_nature');
  }
}
