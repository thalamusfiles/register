import { Entity, Property } from '@mikro-orm/core';

@Entity({
  schema: 'materialized',
  readonly: true,
  expression: `select begindate, statecode, total from "materialized".rel_establishment_by_month_and_state`,
})
export default class RelEstablishmentByMonthAndState {
  @Property()
  begindate: string;

  @Property()
  statecode?: string;

  @Property()
  total?: number;
}
