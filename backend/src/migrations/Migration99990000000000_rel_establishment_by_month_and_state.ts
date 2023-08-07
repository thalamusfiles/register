import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Cria a tabela materializada de estabelecimentos por mes e estado, com dados formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_state as
      select
        substring(e."data"->>'beginDate', 1, 6) as begin_date, 
        e."data"->>'stateCode' as state_code, 
        count(e.hash_id) as total
      from establishment e
      group by begin_date, state_code
      order by begin_date desc, state_code;`,
    );

    // Cria a tabela materializada de estabelecimentos por mes e estado com colunas formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_state_crosstab as
      select * from
      crosstab($$
      select 
        substring(e."data"->>'beginDate', 1, 6) as begin_date, 
        e."data"->>'stateCode' as state_code, 
        count(e.hash_id) as total
      from establishment e
      group by begin_date, state_code
      order by begin_date desc, state_code
      $$,
      $$
      select s.code from address.state s where resource_country_acronym = 'br' order by s.code
      $$
      )
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
