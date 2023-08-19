import { Entity, Property } from '@mikro-orm/core';

@Entity({
  schema: 'materialized',
  readonly: true,
  expression: `select begin_date, nature_code, nt."value"->>'description' as nature, total from "materialized".rel_establishment_by_month_and_nature
    inner join type_key_value nt on nt.hash_id = nature_hash_id`,
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
