import { Entity, Property } from '@mikro-orm/core';

@Entity({
  schema: 'materialized',
  readonly: true,
  expression: `select begin_date, nature_code, nature, total from "materialized".rel_establishment_by_month_and_nature`,
})
export default class RelEstablishmentByMonthAndNature {
  @Property()
  beginDate: string;

  @Property()
  natureCode?: string;

  @Property()
  nature?: string;

  @Property()
  total?: number;
}
