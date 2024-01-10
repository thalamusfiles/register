import { Entity, Property } from '@mikro-orm/core';

@Entity({
  schema: 'materialized',
  readonly: true,
  expression: `select begin_date, state_code, total, total_mei from "materialized".rel_establishment_by_month_and_state`,
})
export default class RelEstablishmentByMonthAndState {
  @Property()
  beginDate: string;

  @Property()
  stateCode?: string;

  @Property()
  total?: number;

  @Property()
  totalMei?: number;
}
