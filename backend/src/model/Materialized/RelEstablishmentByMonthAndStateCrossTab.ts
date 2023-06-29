import { Entity, Property } from '@mikro-orm/core';

@Entity({
  schema: 'materialized',
  readonly: true,
  expression: `select * from "materialized".rel_establishment_by_month_and_state_crosstab`,
})
export default class RelEstablishmentByMonthAndStateCrossTab {
  @Property()
  date: string;

  @Property()
  ac!: number;

  @Property()
  al!: number;

  @Property()
  am!: number;

  @Property()
  ap!: number;

  @Property()
  ba!: number;

  @Property()
  ce!: number;

  @Property()
  df!: number;

  @Property()
  es!: number;

  @Property()
  ex!: number;

  @Property()
  go!: number;

  @Property()
  ma!: number;

  @Property()
  mg!: number;

  @Property()
  ms!: number;

  @Property()
  mt!: number;

  @Property()
  pa!: number;

  @Property()
  pb!: number;

  @Property()
  pe!: number;

  @Property()
  pi!: number;

  @Property()
  pr!: number;

  @Property()
  rj!: number;

  @Property()
  rn!: number;

  @Property()
  ro!: number;

  @Property()
  rr!: number;

  @Property()
  rs!: number;

  @Property()
  sc!: number;

  @Property()
  se!: number;

  @Property()
  sp!: number;

  @Property()
  to!: number;
}
