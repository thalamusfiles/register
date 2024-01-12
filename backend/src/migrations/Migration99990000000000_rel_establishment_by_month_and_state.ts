import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Cria a tabela materializada de estabelecimentos por mes e estado, com dados formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_state as
      select
        cast(e.begin_date as varchar(6)) as begin_date, 
        e.state_code as state_code,
        count(e.hash_id) filter (where not (pr.is_mei is true or pr."nature_code" = '2135')) total,
        count(e.hash_id) filter (where pr.is_mei is true or pr."nature_code" = '2135') total_mei
      from establishment e
      left join person_resource pr on pr.person_hash_id = e.person_hash_id
      group by 1, 2
      order by begin_date desc, state_code;`,
    );

    // Cria a tabela materializada de estabelecimentos por mes e estado com colunas formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_state_crosstab as
      select * from crosstab(
      $$
        select begin_date, upper(state_code) , total
        from "materialized".rel_establishment_by_month_and_state
        order by begin_date ASC, state_code ASC
      $$,
      $$
        select s.code from address.state s where resource_country_acronym = 'br' and code <> 'BR' order by s.code ASC
      $$)
      as rel_establishment_by_month_and_state_crostab(date varchar(6),
        ac int4, al int4, am int4, ap int4, ba int4, ce int4,
        df int4, es int4, ex int4, go int4, ma int4, mg int4,
        ms int4, mt int4, pa int4, pb int4, pe int4, pi int4,
        pr int4, rj int4, rn int4, ro int4, rr int4, rs int4,
        sc int4, se int4, sp int4, "to" int4);`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_state_crostab');
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_state');
  }
}
