import { Entity, Filter, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { establishmentHashIdWhere } from '../../commons/hash-id';

@Filter({
  name: 'document',
  cond: async (args, type, em: EntityManager) => {
    return {
      hashId: em.raw(establishmentHashIdWhere(args.document)),
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
