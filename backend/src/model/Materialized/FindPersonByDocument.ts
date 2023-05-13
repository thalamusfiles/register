import { Entity, Property } from '@mikro-orm/core';

@Entity({ schema: 'materialized', expression: `select key, brGovDados from "materialized".find_person_by_document` })
export default class FindPersonByDocument {
  @Property({ type: 'varchar' })
  key: string;

  @Property({ type: 'json' })
  brGovDados!: string;
}
