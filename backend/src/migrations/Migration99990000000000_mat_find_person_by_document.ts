import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Dropa a tabale materializada anterior
    this.addSql('drop materialized view if exists "materialized".find_person_by_document');

    // Cria a tabela materializada
    this.addSql(
      `create materialized view if not exists "materialized".find_person_by_document
      as
      select 
      'br:cnpj:' || p."document" as key,
      json_build_object(
        'documentType', p.document_type,
        'documentStart', p.document,
        'document', e.extra_key,
        'name', p."name",
        'fantasyName', e."data"->>'name',
        'captal', pr."data"->>'capital',
        /**/
        'mainActivity', e."data"->>'mainActivity',
        'mainActivityDescription', activity."value"->>'description',
        'otherActivities', e."data"->>'otherActivities',
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
        /*Others*/
        'reason', reason."value"->>'description'
      ) as brGovDados
    from person p
    inner join person_resource pr on pr.person_uuid = p.uuid 
    inner join establishment e on e.person_uuid = p.uuid
    inner join contact c on c.person_uuid = p.uuid 
    left join "address".country country on country.resource_country_acronym = 'br' and country.code = (e."data"->>'countryCode')::int4
    left join "address".city city on city.resource_country_acronym = 'br' and city.code = (e."data"->>'cityCode')::int4
    left join type_key_value activity on activity.resource_country_acronym = 'br' and activity."type" = 'cnae' and activity.key = e."data"->>'mainActivity' 
    left join type_key_value reason on activity.resource_country_acronym = 'br' and reason."type" = 'reason' and reason.key = e."data"->>'reason'
    where p.person_type = 'legal'
    and e."data"->>'countryCode' <> ''
    and c."data"->>'phone' is not null
    limit 10`,
    );

    // Cria o indice da tabela materializada
    this.addSql('create index find_person_by_document_key_unique on "materialized".find_person_by_document(key);');
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".find_person_by_document');
  }
}
