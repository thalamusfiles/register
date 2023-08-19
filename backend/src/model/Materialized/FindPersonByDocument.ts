import { Entity, Filter, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Filter({
  name: 'document',
  cond: async (args, type, em: EntityManager) => {
    return {
      hashId: em.raw(`hashtextextended('br:br_gov_dados:${args.document}', 1)`),
    };
  },
})
@Entity({ schema: 'materialized', readonly: true, expression: `select hash_id, key, "brGovDados" from "materialized".find_person_by_document` })
export default class FindPersonByDocument {
  @Property()
  hashId: string;

  @Property()
  key: string;

  @Property()
  brGovDados?: any;
}
