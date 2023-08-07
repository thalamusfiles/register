import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Dropa a tabale materializada anterior
    this.addSql('drop materialized view if exists "materialized".find_person_by_document');

    // Cria a tabela materializada
    this.addSql(
      `create materialized view if not exists "materialized".find_person_by_document as
       select 
      'br:cnpj:' || (select a[1] || '/' || lpad(a[2], 4, '0') || '-' || lpad(a[3], 2, '0') from REGEXP_MATCHES(e.extra_key, '(.*)/(\d+)-(.*)') a) as key,
      json_build_object(
        'documentType', p.document_type,
        'documentStart', p.document,
        'document', (select a[1] || '/' || lpad(a[2], 4, '0') || '-' || lpad(a[3], 2, '0') from REGEXP_MATCHES(e.extra_key, '(.*)/(\d+)-(.*)') a),
        'name', p."name",
        'fantasyName', e."data"->>'name',
        'captal', pr."data"->>'capital',
        /**/
        'mainActivity', e."main_activity",
        'mainActivityDescription', activity."value"->>'description',
        'otherActivities', e."other_activities",
        /*status*/
        'sizeCode', pr."data"->>'sizeCode',
        'natureCode', pr."data"->>'natureCode',
        'nature', nt."value"->>'description',
        'status', e."data"->>'status',
        'statusDate', e."data"->>'statusDate',
        /*Address*/
        'zipcode', e."data"->>'zipcode',
        'countryCode', e."data"->>'countryCode',
        'countryName', country."name",
        'stateCode', e."data"->>'stateCode',
        'cityCode', e."data"->>'cityCode',
        'cityName', city."name",
        'complement', e."data"->>'complement',
        'publicPlaceCode', e."data"->>'publicPlaceCode',
        'publicPlace', e."data"->>'publicPlace',
        'neighborhood', e."data"->>'neighborhood',
        'number', e."data"->>'number',
        /*Contact*/
        'fax', c."data"->>'fax',
        'email', c."data"->>'email',
        'phone', c."data"->>'phone',
        /*Partner*/
        'partners', (select
          json_agg(json_build_object(
            'partner', partner."data"->>'partner',
            'partnerDoc', partner."data"->>'partnerDoc',
            'partnerTp', partner."data"->>'partnerTp',
            'representativeName', partner."data"->>'representativeName',
            'representativeDoc', partner."data"->>'representativeDoc'
          )) from partner
          where partner.resource_country_acronym = 'br' and partner.resource_hash_id = r.hash_id and partner.establishment_hash_id = e.hash_id
        ),
        /*Others*/
        'simples', json_build_object(
          'is', pr."data"->>'isSimple',
          'createdAt', pr."data"->>'simpleCreatedAt',
          'deletedAt', pr."data"->>'simpleDeletedAt'
        ),
        'MEI', json_build_object(
          'is', pr."data"->>'isMEI',
          'createdAt', pr."data"->>'MEICreatedAt',
          'deletedAt', pr."data"->>'MEIDeletedAt'
        ),
        'reason', reason."value"->>'description'
      ) as "brGovDados"
    from person p cross join resource r
    inner join person_resource pr on pr.resource_country_acronym = 'br' and pr.resource_hash_id = r.hash_id and pr.person_hash_id = p.hash_id 
    inner join establishment e    on e.resource_country_acronym = 'br'  and e.resource_hash_id = r.hash_id and e.person_hash_id = p.hash_id
    inner join contact c          on c.resource_country_acronym = 'br'  and c.resource_hash_id = r.hash_id and c.person_hash_id = p.hash_id and e.extra_key = c.extra_key
    left join "address".country country on country.resource_country_acronym = 'br'  and country.resource_hash_id = r.hash_id  and country.code::varchar = e."data"->>'countryCode'
    left join "address".city city       on city.resource_country_acronym = 'br'     and city.resource_hash_id = r.hash_id     and city.code::varchar =e."data"->>'cityCode'
    left join type_key_value activity   on activity.resource_country_acronym = 'br' and activity.resource_hash_id = r.hash_id and activity."type" = 'cnae' and activity.key = e."main_activity"
    left join type_key_value reason     on reason.resource_country_acronym = 'br'   and reason.resource_hash_id = r.hash_id   and reason."type" = 'reason' and reason.key = e."data"->>'reason'
    left join type_key_value nt         on nt.resource_country_acronym = 'br'       and nt.resource_hash_id = r.hash_id       and nt."type" = 'nature'     and nt.key = pr."data"->>'natureCode'
    where p.person_type = 'legal' and r."name" = 'br_gov_dados'`,
    );

    // Cria o indice da tabela materializada
    this.addSql('create index find_person_by_document_key_unique on "materialized".find_person_by_document(key);');
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".find_person_by_document');
  }
}
