import { Dictionary, Entity, Filter, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { establishmentHash } from '../../commons/hash-id';

@Entity({
  readonly: true,
  expression: (em: EntityManager, where: any, options) => {
    return em.execute(
      em.getKnex().raw(FindSubsidiariesQuery, {
        //
        parentHash: establishmentHash(where.parentDoc),
        levels: (options.filters as Dictionary).levels.levels,
      }),
    );
  },
})
export default class FindSubsidiaries {
  @Property()
  parentDoc: string;

  @Property()
  subsidiaryHashId: string;

  @Property()
  subsidiaryDoc: string;

  @Property()
  subsidiary: string;

  @Property()
  stateCode: string;

  @Property()
  cityName: string;
}

const FindSubsidiariesQuery = `
  WITH RECURSIVE parent_subsidiary AS (
    select 
      1 as level,
      est.hash_id as subsidiary_hash_id,
      est.extra_key as subsidiary_doc, 
      ''::varchar as parent_doc
    from establishment est
    where est.hash_id = hashtextextended(:parentHash, 1)
  union
    select 
      ps.level + 1,
      part.establishment_hash_id,
      (select est.extra_key from establishment est where est.hash_id = part.establishment_hash_id limit 1),
      part.partner_doc
    from parent_subsidiary ps
    inner join partner part on part.extra_key = regexp_replace(ps.subsidiary_doc,'[^[:digit:]]','','g')
    where ps.level = :levels
  )
  select 
    parent_doc as "parentDoc",
    est.hash_id as "subsidiaryHashId",
    est.extra_key as "subsidiaryDoc",
    person."name" as "subsidiary",
    est.state_code as "stateCode",
    city.name as cityName
  from establishment est 
  inner join parent_subsidiary ps on est.hash_id = ps.subsidiary_hash_id
  left join person on person.hash_id = est.person_hash_id
  left join address.city on city.hash_id = est.city_hash_id
  where est.hash_id in (select ps.subsidiary_hash_id from parent_subsidiary ps)
  order by parent_doc nulls first`;
