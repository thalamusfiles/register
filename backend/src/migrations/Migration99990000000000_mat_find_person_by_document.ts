import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    // Dropa a tabale materializada anterior
    //this.addSql('drop materialized view if exists "materialized".find_person_by_document');

    // Cria a tabela materializada
    this.addSql(
      `create or replace view "materialized".find_person_by_document as
      select 
      e.hash_id,
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
       'naturePerson', pr."data"->>'natureCode' in ('2135') or not exists(select 1 from partner where partner.establishment_hash_id = e.hash_id limit 1),
       'status', e."data"->>'status',
       'statusDate', e."data"->>'statusDate',
       /*Address*/
       'zipcode', case when pr."data"->>'natureCode' in ('2135') then null else e."data"->>'zipcode' end,
       'countryCode', e."data"->>'countryCode',
       'countryName', country."name",
       'stateCode', e."data"->>'stateCode',
       'cityCode', e."data"->>'cityCode',
       'cityName', case when pr."data"->>'natureCode' in ('2135') then null else city."name" end,
       'complement', case when pr."data"->>'natureCode' in ('2135') then null else e."data"->>'complement' end,
       'publicPlaceCode', case when pr."data"->>'natureCode' in ('2135') then null else e."data"->>'publicPlaceCode' end,
       'publicPlace', case when pr."data"->>'natureCode' in ('2135') then null else e."data"->>'publicPlace' end,
       'neighborhood', case when pr."data"->>'natureCode' in ('2135') then null else e."data"->>'neighborhood' end,
       'number', case when pr."data"->>'natureCode' in ('2135') then null else e."data"->>'number' end,
       /*Contact*/
       'fax', case when pr."data"->>'natureCode' in ('2135') then null else c."data"->>'fax' end,
       'phone', case when pr."data"->>'natureCode' in ('2135') then null else c."data"->>'phone' end,
       'email', c."data"->>'email',
       /*Partner*/
       'partners', (select
         json_agg(json_build_object(
           'partner', partner."data"->>'partner',
           'partnerDoc', partner."data"->>'partnerDoc',
           'partnerTp', partner."data"->>'partnerTp',
           'representativeName', partner."data"->>'representativeName',
           'representativeDoc', partner."data"->>'representativeDoc'
         )) from partner
         where partner.establishment_hash_id = e.hash_id
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
   from establishment e
   left join person p           on p.hash_id = e.person_hash_id
   left join person_resource pr on pr.person_hash_id = e.person_hash_id
   left join contact c           on c.person_hash_id = e.person_hash_id and e.extra_key = c.extra_key
   left join "address".country country on country.hash_id = hashtextextended('br:br_gov_dados:' || nullif(e."data"->>'countryCode', ''), 1)
   left join "address".city city       on city.hash_id = hashtextextended('br:br_gov_dados:' || nullif(e."data"->>'cityCode',''), 1)
   left join type_key_value activity   on activity.hash_id = hashtextextended( 'br:br_gov_dados:cnae:' || e."main_activity" , 1)
   left join type_key_value reason     on reason.hash_id = hashtextextended( 'br:br_gov_dados:reason:' || (e."data"->>'reason') , 1)
   left join type_key_value nt         on nt.hash_id = hashtextextended( 'br:br_gov_dados:nature:' || (pr."data"->>'natureCode') , 1);`,
    );

    // Cria o indice da tabela materializada
    //this.addSql('create index find_person_by_document_key_unique on "materialized".find_person_by_document(key);');
  }

  async down(): Promise<void> {
    //this.addSql('drop materialized view if exists "materialized".find_person_by_document');
    this.addSql('drop view "materialized".find_person_by_document');
  }
}
