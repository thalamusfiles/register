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
       'fantasyName', e.name,
       'captal', pr."capital",
       /**/
       'mainActivity', e."main_activity",
       'mainActivityDescription', activity."value"->>'description',
       'otherActivities', e."other_activities",
       /*status*/
       'sizeCode', pr."size_code",
       'natureCode', pr."nature_code",
       'nature', nt."value"->>'description',
       'naturePerson', pr."nature_code" in ('2135') or not exists(select 1 from partner where partner.establishment_hash_id = e.hash_id limit 1),
       'status', e.status,
       'statusDate', e.status_date,
       /*Address*/
       'zipcode', case when pr."nature_code" in ('2135') then null else e.zipcode end,
       'countryCode', e.country_code,
       'countryName', country."name",
       'stateCode', e.state_code,
       'cityCode', e.city_code,
       'cityName', case when pr."nature_code" in ('2135') then null else city."name" end,
       'complement', case when pr."nature_code" in ('2135') then null else e.complement end,
       'publicPlaceCode', case when pr."nature_code" in ('2135') then null else e.public_place_code end,
       'publicPlace', case when pr."nature_code" in ('2135') then null else e.public_place end,
       'neighborhood', case when pr."nature_code" in ('2135') then null else e.neighborhood end,
       'number', case when pr."nature_code" in ('2135') then null else e.number end,
       /*Contact*/
       'fax', case when pr."nature_code" in ('2135') then null else c.fax end,
       'phone', case when pr."nature_code" in ('2135') then null else c.phone end,
       'email', c.email,
       /*Partner*/
       'partners', (select
         json_agg(json_build_object(
           'partner', partner.partner,
           'partnerDoc', partner.partner_doc,
           'partnerTp', partner.partner_tp,
           'representativeName', partner.representative_name,
           'representativeDoc', partner.representative_doc
         )) from partner
         where partner.establishment_hash_id = e.hash_id
       ),
       /*Others*/
       'simples', json_build_object(
         'is', pr.is_simple,
         'createdAt', pr.simple_created_at,
         'deletedAt', pr.simple_deleted_at
       ),
       'MEI', json_build_object(
         'is', pr.is_mei,
         'createdAt', pr.mei_created_at,
         'deletedAt', pr.mei_deleted_at
       ),
       'reason', reason."value"->>'description'
     ) as "brGovDados"
   from establishment e
   left join person p           on p.hash_id = e.person_hash_id
   left join person_resource pr on pr.person_hash_id = e.person_hash_id
   left join contact c           on c.person_hash_id = e.person_hash_id and e.extra_key = c.extra_key
   left join "address".country country on country.hash_id = hashtextextended('br:br_gov_dados:' || nullif(e.country_code, ''), 1)
   left join "address".city city       on city.hash_id = hashtextextended('br:br_gov_dados:' || nullif(e.city_code,''), 1)
   left join type_key_value activity   on activity.hash_id = hashtextextended( 'br:br_gov_dados:cnae:' || e."main_activity" , 1)
   left join type_key_value reason     on reason.hash_id = hashtextextended( 'br:br_gov_dados:reason:' || (e.reason) , 1)
   left join type_key_value nt         on nt.hash_id = hashtextextended( 'br:br_gov_dados:nature:' || (pr."nature_code") , 1);`,
    );

    // Cria o indice da tabela materializada
    //this.addSql('create index find_person_by_document_key_unique on "materialized".find_person_by_document(key);');
  }

  async down(): Promise<void> {
    //this.addSql('drop materialized view if exists "materialized".find_person_by_document');
    this.addSql('drop view "materialized".find_person_by_document');
  }
}
