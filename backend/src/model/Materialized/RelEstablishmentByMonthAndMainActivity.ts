import { Entity, Property } from '@mikro-orm/core';

@Entity({
  schema: 'materialized',
  readonly: true,
  expression: `select begin_date, main_activity, total, total_mei from "materialized".rel_establishment_by_month_and_main_activity`,
})
export default class RelEstablishmentByMonthAndMainActivity {
  @Property()
  beginDate: string;

  @Property()
  mainActivity?: string;

  @Property()
  total?: number;

  @Property()
  totalMei?: number;
}
