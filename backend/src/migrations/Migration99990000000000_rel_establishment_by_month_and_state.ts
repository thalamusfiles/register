import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Cria a tabela materializada de estabelecimentos por mes e estado, com dados formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_state as
      select 
        substring(e."data"->>'beginDate', 1, 6) as beginDate, 
        e."data"->>'stateCode' as stateCode, 
        count(e.uuid) as total
      from establishment e
      group by beginDate, stateCode
      order by beginDate desc, stateCode`,
    );

    // Cria a tabela materializada de estabelecimentos por mes e estado com colunas formatados
    this.addSql(
      `create materialized view if not exists "materialized".rel_establishment_by_month_and_state_crosstab as
      Select * from
      crosstab($$
      select 
        substring(e."data"->>'beginDate', 1, 6) as beginDate, 
        e."data"->>'stateCode' as stateCode, 
        count(e.uuid) as total
      from establishment e
      group by beginDate, stateCode
      order by beginDate desc, stateCode
      $$,
      $$
      select s.code from address.state s where resource_country_acronym = 'br' order by s.code
      $$
      )
      as rel_establishment_by_month_and_state_crostab(date varchar(6),AC int8, AL int8, AM int8, AP int, BA int, CE int, DF int, ES int,EX int, GO int, MA int, MG int, MS int, MT int, PA int, PB int, PE int, PI int, PR int, RJ int, RN int, RO int, RR int, RS int, SC int, SE int, SP int, "TO" int);`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_state_crostab');
    this.addSql('drop materialized view if exists "materialized".rel_establishment_by_month_and_state');
  }
}
