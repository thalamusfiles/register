import { Dictionary, Entity, Filter, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { establishmentHash } from '../../commons/hash-id';

@Entity({
  readonly: true,
  expression: (em: EntityManager, where: any, options) => {
    const filters = options.filters as Dictionary;

    const params = {
      //
      parentHashId: filters.parent.hashId,
      parentPersonHashId: filters.parent.personHashid,
      levels: filters.levels.levels,
    };

    return em.execute(em.getKnex().raw(FindSubsidiariesQuery, params));
  },
})
export default class FindSubsidiaries {
  @Property()
  type: 'parent' | 'subsidiary' | 'partnerof';

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
WITH RECURSIVE parent_subsidiary (level, subsidiary_hash_id, subsidiary_doc, parent_doc, "type") AS (
  select 1,
    est.hash_id,
    est.extra_key, 
    ''::varchar as parent_doc,
    'parent'
  from establishment est
  where est.hash_id = :parentHashId
union
select 2, 
    est.hash_id, 
    est.extra_key
      ,(select regexp_replace(est.extra_key,'[^[:digit:]]','','g') from establishment est where est.hash_id = :parentHashId)
      , 'subsidiary'
    from establishment est
    where est.person_hash_id = (select est.person_hash_id from establishment est where est.hash_id = :parentPersonHashId)
    and est.hash_id <> :parentHashId
union
select 
    ps.level + 1,
    part.establishment_hash_id,
    (select est.extra_key from establishment est where est.hash_id = part.establishment_hash_id limit 1),
    part.partner_doc
    ,'partnerof'
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
  city.name as "cityName",
  "type"
from establishment est 
inner join parent_subsidiary ps on est.hash_id = ps.subsidiary_hash_id
left join person on person.hash_id = est.person_hash_id
left join address.city on city.hash_id = est.city_hash_id
where est.hash_id in (select ps.subsidiary_hash_id from parent_subsidiary ps)
order by parent_doc nulls first`;
