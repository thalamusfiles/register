import { Migration } from '@mikro-orm/migrations';

export class Migration20230509115642 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".find_person_by_document');
    this.addSql(
      `create materialized view if not exists "materialized".find_person_by_document
      as
      select 
        'br:cnpj:' || p."document" as key,
        json_build_object(
          'documentType', p.document_type,
          'document', p.document,
          'name', p."name",
          'captal', pr."data"->>'capital'
        ) as brGovDados
      from person p
      inner join person_resource pr on pr.person_uuid = p.uuid 
      where p.person_type = 'legal';`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop materialized view if exists "materialized".find_person_by_document');
  }
}
