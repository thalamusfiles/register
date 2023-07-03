import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {

    // Cria a tabela materializada de estabelecimentos por mes e estado, com dados formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_nature as
      select 
        substring(e."data"->>'beginDate', 1, 6) as "beginDate", 
        nt."key" as "natureCode", 
        nt."value"->>'description' as nature, 
        count(e.uuid) as total
      from person_resource pr
      inner join establishment e    on e.resource_country_acronym = 'br' and e.person_uuid = pr.person_uuid
      inner join type_key_value nt  on nt.resource_country_acronym = 'br' and nt."type" = 'nature' and nt.key = pr."data"->>'natureCode'
      group by "beginDate", nt.uuid 
      order by "beginDate" desc, "natureCode";`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_nature');
  }
}
