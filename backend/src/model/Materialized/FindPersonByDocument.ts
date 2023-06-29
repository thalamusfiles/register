import { Entity, Property } from '@mikro-orm/core';

@Entity({ schema: 'materialized', readonly: true, expression: `select key, "brGovDados" from "materialized".find_person_by_document` })
export default class FindPersonByDocument {
  @Property()
  key: string;

  @Property()
  brGovDados?: any;
}
