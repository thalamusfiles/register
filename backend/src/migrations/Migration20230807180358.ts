import { Migration } from '@mikro-orm/migrations';

export class Migration20230807180358 extends Migration {
  async dropConst(): Promise<void> {
    this.addSql('alter table "person_resource" drop constraint "person_resource_resource_uuid_foreign";');
    this.addSql('alter table "person_resource" drop constraint "person_resource_person_uuid_foreign";');
    this.addSql('alter table "address"."country" drop constraint "country_resource_uuid_foreign";');
    this.addSql('alter table "contact" drop constraint "contact_resource_uuid_foreign";');
    this.addSql('alter table "contact" drop constraint "contact_person_uuid_foreign";');
    this.addSql('alter table "address"."state" drop constraint "state_resource_uuid_foreign";');
    this.addSql('alter table "address"."city" drop constraint "city_resource_uuid_foreign";');
    this.addSql('alter table "address"."city" drop constraint "city_state_uuid_foreign";');
    this.addSql('alter table "establishment" drop constraint "establishment_resource_uuid_foreign";');
    this.addSql('alter table "establishment" drop constraint "establishment_person_uuid_foreign";');
    this.addSql('alter table "establishment" drop constraint "establishment_country_uuid_foreign";');
    this.addSql('alter table "establishment" drop constraint "establishment_city_uuid_foreign";');
    this.addSql('alter table "partner" drop constraint "partner_resource_uuid_foreign";');
    this.addSql('alter table "partner" drop constraint "partner_establishment_uuid_foreign";');
    this.addSql('alter table "type_key_value" drop constraint "type_key_value_resource_uuid_foreign";');
  }

  async dropMaterialized(): Promise<void> {
    this.addSql('drop materialized view "materialized".find_person_by_document;');
    this.addSql('drop materialized view "materialized".rel_establishment_by_month_and_main_activity; ');
    this.addSql('drop materialized view "materialized".rel_establishment_by_month_and_nature; ');
    this.addSql('drop materialized view "materialized".rel_establishment_by_month_and_state;');
    this.addSql('drop materialized view "materialized".rel_establishment_by_month_and_state_crosstab;');
  }

  async dropPK(): Promise<void> {
    this.addSql('alter table "resource" drop constraint "resource_pkey";');
    this.addSql('alter table "person" drop constraint "person_pkey";');
    this.addSql('alter table "person_resource" drop constraint "person_resource_pkey";');
    this.addSql('alter table "address"."country" drop constraint "country_pkey";');
    this.addSql('alter table "contact" drop constraint "contact_pkey";');
    this.addSql('alter table "address"."state" drop constraint "state_pkey";');
    this.addSql('alter table "address"."city" drop constraint "city_pkey";');
    this.addSql('alter table "establishment" drop constraint "establishment_pkey";');
    this.addSql('alter table "partner" drop constraint "partner_pkey";');
    this.addSql('alter table "type_key_value" drop constraint "type_key_value_pkey";');
  }

  async dropUniq(): Promise<void> {
    this.addSql('alter table "person" drop constraint "person_resource_country_acronym_person_type_docume_61d85_unique";');
    this.addSql('alter table "person_resource" drop constraint "person_resource_resource_country_acronym_resource__13f13_unique";');
    this.addSql('alter table "address"."country" drop constraint "country_resource_country_acronym_resource_uuid_code_unique";');
    this.addSql('alter table "contact" drop constraint "contact_resource_country_acronym_resource_uuid_per_759d7_unique";');
    this.addSql('alter table "address"."state" drop constraint "state_resource_country_acronym_resource_uuid_code_unique";');
    this.addSql('alter table "address"."city" drop constraint "city_resource_country_acronym_resource_uuid_code_unique";');
    this.addSql('alter table "establishment" drop constraint "establishment_resource_country_acronym_resource_uu_d04cc_unique";');
    this.addSql('alter table "partner" drop constraint "partner_resource_country_acronym_resource_uuid_per_7cbab_unique";');
    this.addSql('alter table "type_key_value" drop constraint "type_key_value_resource_country_acronym_resource_u_ab2ab_unique";');
  }

  async addColumn() {
    this.addSql('alter table "resource" add column "hash_id" bigint not null default 0;');
    this.addSql('alter table "person" add column "hash_id" bigint not null default 0;');
    this.addSql('alter table "person_resource" add column "hash_id" bigint not null default 0, add column "resource_hash_id" bigint not null default 0, add column "person_hash_id" bigint not null default 0;');
    this.addSql('alter table "address"."country" add column "hash_id" bigint not null default 0, add column "resource_hash_id" bigint not null default 0;');
    this.addSql('alter table "contact" add column "hash_id" bigint not null default 0, add column "resource_hash_id" bigint not null default 0, add column "person_hash_id" bigint not null default 0;');
    this.addSql('alter table "address"."state" add column "hash_id" bigint not null default 0, add column "resource_hash_id" bigint not null default 0;');
    this.addSql('alter table "address"."city" add column "hash_id" bigint not null default 0, add column "resource_hash_id" bigint not null default 0, add column "state_hash_id" bigint null default 0;');
    this.addSql('alter table "establishment" add column "hash_id" bigint not null default 0, add column "resource_hash_id" bigint not null default 0, add column "person_hash_id" bigint not null default 0, add column "country_hash_id" bigint null, add column "city_hash_id" bigint null default 0;');
    this.addSql('alter table "partner" add column "hash_id" bigint not null default 0, add column "resource_hash_id" bigint not null default 0, add column "establishment_hash_id" bigint not null default 0;');
    this.addSql('alter table "type_key_value" add column "hash_id" bigint not null default 0, add column "resource_hash_id" bigint not null default 0;');

    this.addSql('alter table "resource" alter column "hash_id" drop default;');
    this.addSql('alter table "person" alter column "hash_id" drop default;');
    this.addSql('alter table "person_resource" alter column "hash_id" drop default, alter column "resource_hash_id" drop default, alter column "person_hash_id" drop default;');
    this.addSql('alter table "address"."country" alter column "hash_id" drop default, alter column "resource_hash_id" drop default;');
    this.addSql('alter table "contact" alter column "hash_id" drop default, alter column "resource_hash_id" drop default, alter column "person_hash_id" drop default;');
    this.addSql('alter table "address"."state" alter column "hash_id" drop default, alter column "resource_hash_id" drop default;');
    this.addSql('alter table "address"."city" alter column "hash_id" drop default, alter column "resource_hash_id" drop default, alter column "state_hash_id" drop default;');
    this.addSql('alter table "establishment" alter column "hash_id" drop default, alter column "resource_hash_id" drop default, alter column "person_hash_id" drop default, alter column "country_hash_id" drop default, alter column "city_hash_id" drop default;');
    this.addSql('alter table "partner" alter column "hash_id" drop default, alter column "resource_hash_id" drop default, alter column "establishment_hash_id" drop default;');
    this.addSql('alter table "type_key_value" alter column "hash_id" drop default, alter column "resource_hash_id" drop default;');
  }

  async updatePk(): Promise<void> {
    this.addSql(`update resource set hash_id = hashtextextended('br:' || name, 1);`);
    this.addSql(`update address.city set hash_id = hashtextextended('br:br_gov_dados:' || code, 1);`);
    this.addSql(`update address.country set hash_id = hashtextextended('br:br_gov_dados:' || code, 1);`);
    this.addSql(`update address.state set hash_id = hashtextextended('br:br_gov_dados:' || code, 1);`);
    this.addSql(`update type_key_value set hash_id = hashtextextended( 'br:br_gov_dados:' || "type"  || ':' || "value" , 1);`);
    this.addSql(`update person set hash_id = hashtextextended('br:' || person_type || ':' || document_type || ':' || "document" , 1);`);
    this.addSql(`update person_resource set hash_id = hashtextextended('br:br_gov_dados:' || (select document from person p where p.uuid = person_resource.person_uuid) , 1);`);
    this.addSql(`update establishment set hash_id = hashtextextended('br:br_gov_dados:' || extra_key, 1);`);
    this.addSql(`update contact set hash_id = hashtextextended('br:br_gov_dados:' || extra_key, 1);`);
    this.addSql(`update parter set hash_id = hashtextextended('br:br_gov_dados:' || (select extra_key from establishment e where e.uuid = partner.establishment_uuid) || ':' || extra_key, 1);`);
  }

  async update(): Promise<void> {
    this.addSql(`update "type_key_value" set "resource_hash_id" = hashtextextended('br:br_gov_dados', 1);`);
    this.addSql(`update "address"."country" set "resource_hash_id" = hashtextextended('br:br_gov_dados', 1);`);
    this.addSql(`update "address"."state" set "resource_hash_id" = hashtextextended('br:br_gov_dados', 1);`);
    this.addSql(`update "address"."city" set "resource_hash_id" = hashtextextended('br:br_gov_dados', 1), "state_hash_id" = "";`);
    this.addSql(`update "person_resource" set "resource_hash_id" = hashtextextended('br:br_gov_dados', 1), "person_hash_id" = (select hashtextextended('br:legal:cnpj:' || "document" , 1) from person p where p.uuid = person_resource.person_uuid);`);
    this.addSql(`update "contact" set "resource_hash_id" = hashtextextended('br:br_gov_dados', 1), "person_hash_id" = (select hashtextextended('br:legal:cnpj:' || "document" , 1) from person p where p.uuid = contact.person_uuid);`);
    this.addSql(`
      update "establishment" set "resource_hash_id" = hashtextextended('br:br_gov_dados', 1), 
        "person_hash_id" = (select hashtextextended('br:legal:cnpj:' || "document" , 1) from person p where p.uuid = establishment.person_uuid),
        "country_hash_id" = (select hashtextextended('br:br_gov_dados:' || code, 1) from address.country c where c.uuid = establishment.country_uuid), 
        "city_hash_id"  = (select hashtextextended('br:br_gov_dados:' || code, 1) from address.city c where c.uuid = establishment.city_uuid);`);
    this.addSql(`update "partner" set"resource_hash_id" = hashtextextended('br:br_gov_dados', 1), "establishment_hash_id" = (select hashtextextended('br:br_gov_dados:' || extra_key, 1) from establishment e where e.uuid = partner.establishment_uuid);`);

  }

  async dropColumnUuid() {
    //this.addSql('alter table "resource" drop column "uuid";');
    this.addSql('alter table "person" drop column "uuid";');
    this.addSql('alter table "person_resource" drop column "uuid";');
    this.addSql('alter table "person_resource" drop column "resource_uuid";');
    this.addSql('alter table "person_resource" drop column "person_uuid";');
    //this.addSql('alter table "address"."country" drop column "uuid";');
    //this.addSql('alter table "address"."country" drop column "resource_uuid";');
    //this.addSql('alter table "contact" drop column "uuid";');
    //this.addSql('alter table "contact" drop column "resource_uuid";');
    //this.addSql('alter table "contact" drop column "person_uuid";');
    //this.addSql('alter table "address"."state" drop column "uuid";');
    //this.addSql('alter table "address"."state" drop column "resource_uuid";');
    //this.addSql('alter table "address"."city" drop column "uuid";');
    //this.addSql('alter table "address"."city" drop column "resource_uuid";');
    //this.addSql('alter table "address"."city" drop column "state_uuid";');
    this.addSql('alter table "establishment" drop column "uuid";');
    this.addSql('alter table "establishment" drop column "resource_uuid";');
    this.addSql('alter table "establishment" drop column "person_uuid";');
    this.addSql('alter table "establishment" drop column "country_uuid";');
    this.addSql('alter table "establishment" drop column "city_uuid";');
    //this.addSql('alter table "partner" drop column "uuid";');
    //this.addSql('alter table "partner" drop column "resource_uuid";');
    //this.addSql('alter table "partner" drop column "establishment_uuid";');
    //this.addSql('alter table "type_key_value" drop column "uuid";');
    //this.addSql('alter table "type_key_value" drop column "resource_uuid";');
  }

  async addConstraint(): Promise<void> {
    //this.addSql('alter table "resource" add constraint "resource_pkey" primary key ("hash_id");');

    this.addSql('alter table "person" add constraint "person_pkey" primary key ("hash_id");');

    this.addSql('alter table "person_resource" add constraint "person_resource_resource_hash_id_foreign" foreign key ("resource_hash_id") references "resource" ("hash_id") on update cascade;');
    this.addSql('alter table "person_resource" add constraint "person_resource_person_hash_id_foreign" foreign key ("person_hash_id") references "person" ("hash_id") on update cascade;');
    this.addSql('alter table "person_resource" add constraint "person_resource_resource_country_acronym_resource__ef17e_unique" unique ("resource_country_acronym", "resource_hash_id", "person_hash_id");');
    this.addSql('alter table "person_resource" add constraint "person_resource_pkey" primary key ("hash_id");');

    //this.addSql('alter table "address"."country" add constraint "country_resource_hash_id_foreign" foreign key ("resource_hash_id") references "resource" ("hash_id") on update cascade;');
    //this.addSql('alter table "address"."country" add constraint "country_pkey" primary key ("hash_id");');

    //this.addSql('alter table "contact" add constraint "contact_resource_hash_id_foreign" foreign key ("resource_hash_id") references "resource" ("hash_id") on update cascade;');
    //this.addSql('alter table "contact" add constraint "contact_person_hash_id_foreign" foreign key ("person_hash_id") references "person" ("hash_id") on update cascade;');
    //this.addSql('alter table "contact" add constraint "contact_resource_country_acronym_resource_hash_id__537f9_unique" unique ("resource_country_acronym", "resource_hash_id", "person_hash_id", "extra_key");');
    //this.addSql('alter table "contact" add constraint "contact_pkey" primary key ("hash_id");');

    //this.addSql('alter table "address"."state" add constraint "state_resource_hash_id_foreign" foreign key ("resource_hash_id") references "resource" ("hash_id") on update cascade;');
    //this.addSql('alter table "address"."state" add constraint "state_pkey" primary key ("hash_id");');
    //this.addSql('alter table "address"."city" add constraint "city_resource_hash_id_foreign" foreign key ("resource_hash_id") references "resource" ("hash_id") on update cascade;');
    //this.addSql('alter table "address"."city" add constraint "city_state_hash_id_foreign" foreign key ("state_hash_id") references "address"."state" ("hash_id") on update cascade on delete set null;');
    //this.addSql('alter table "address"."city" add constraint "city_pkey" primary key ("hash_id");');

    this.addSql('alter table "establishment" add constraint "establishment_resource_hash_id_foreign" foreign key ("resource_hash_id") references "resource" ("hash_id") on update cascade;');
    this.addSql('alter table "establishment" add constraint "establishment_person_hash_id_foreign" foreign key ("person_hash_id") references "person" ("hash_id") on update cascade;');
    this.addSql('alter table "establishment" add constraint "establishment_country_hash_id_foreign" foreign key ("country_hash_id") references "address"."country" ("hash_id") on update cascade on delete set null;');
    this.addSql('alter table "establishment" add constraint "establishment_city_hash_id_foreign" foreign key ("city_hash_id") references "address"."city" ("hash_id") on update cascade on delete set null;');
    this.addSql('alter table "establishment" add constraint "establishment_resource_country_acronym_resource_ha_12617_unique" unique ("resource_country_acronym", "resource_hash_id", "person_hash_id", "extra_key");');
    this.addSql('alter table "establishment" add constraint "establishment_pkey" primary key ("hash_id");');

    //this.addSql('alter table "partner" add constraint "partner_resource_hash_id_foreign" foreign key ("resource_hash_id") references "resource" ("hash_id") on update cascade;');
    //this.addSql('alter table "partner" add constraint "partner_establishment_hash_id_foreign" foreign key ("establishment_hash_id") references "establishment" ("hash_id") on update cascade;');
    //this.addSql('alter table "partner" add constraint "partner_resource_country_acronym_resource_hash_id__8fb37_unique" unique ("resource_country_acronym", "resource_hash_id", "establishment_hash_id", "extra_key");');
    //this.addSql('alter table "partner" add constraint "partner_pkey" primary key ("hash_id");');

    //this.addSql('alter table "type_key_value" add constraint "type_key_value_resource_hash_id_foreign" foreign key ("resource_hash_id") references "resource" ("hash_id") on update cascade;');
    //this.addSql('alter table "type_key_value" add constraint "type_key_value_resource_country_acronym_resource_h_2777d_unique" unique ("resource_country_acronym", "resource_hash_id", "type", "key");');
    //this.addSql('alter table "type_key_value" add constraint "type_key_value_pkey" primary key ("hash_id");');
  }

  async up(): Promise<void> {}

  async down(): Promise<void> {
    this.addSql('alter table "person_resource" drop constraint "person_resource_resource_hash_id_foreign";');
    this.addSql('alter table "person_resource" drop constraint "person_resource_person_hash_id_foreign";');

    this.addSql('alter table "address"."country" drop constraint "country_resource_hash_id_foreign";');

    this.addSql('alter table "contact" drop constraint "contact_resource_hash_id_foreign";');
    this.addSql('alter table "contact" drop constraint "contact_person_hash_id_foreign";');

    this.addSql('alter table "address"."state" drop constraint "state_resource_hash_id_foreign";');

    this.addSql('alter table "address"."city" drop constraint "city_resource_hash_id_foreign";');
    this.addSql('alter table "address"."city" drop constraint "city_state_hash_id_foreign";');

    this.addSql('alter table "establishment" drop constraint "establishment_resource_hash_id_foreign";');
    this.addSql('alter table "establishment" drop constraint "establishment_person_hash_id_foreign";');
    this.addSql('alter table "establishment" drop constraint "establishment_country_hash_id_foreign";');
    this.addSql('alter table "establishment" drop constraint "establishment_city_hash_id_foreign";');

    this.addSql('alter table "partner" drop constraint "partner_resource_hash_id_foreign";');
    this.addSql('alter table "partner" drop constraint "partner_establishment_hash_id_foreign";');

    this.addSql('alter table "type_key_value" drop constraint "type_key_value_resource_hash_id_foreign";');

    this.addSql('alter table "resource" add column "uuid" uuid not null default uuid_generate_v4();');
    this.addSql('alter table "resource" drop constraint "resource_pkey";');
    this.addSql('alter table "resource" drop column "hash_id";');
    this.addSql('alter table "resource" add constraint "resource_pkey" primary key ("uuid");');

    this.addSql('alter table "person" add column "uuid" uuid not null default uuid_generate_v4();');
    this.addSql('alter table "person" drop constraint "person_pkey";');
    this.addSql('alter table "person" drop column "hash_id";');
    this.addSql('alter table "person" add constraint "person_pkey" primary key ("uuid");');

    this.addSql('alter table "person_resource" add column "uuid" uuid not null default uuid_generate_v4(), add column "resource_uuid" uuid not null, add column "person_uuid" uuid not null;');
    this.addSql('alter table "person_resource" drop constraint "person_resource_resource_country_acronym_resource__ef17e_unique";');
    this.addSql('alter table "person_resource" drop constraint "person_resource_pkey";');
    this.addSql('alter table "person_resource" add constraint "person_resource_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;');
    this.addSql('alter table "person_resource" add constraint "person_resource_person_uuid_foreign" foreign key ("person_uuid") references "person" ("uuid") on update cascade;');
    this.addSql('alter table "person_resource" drop column "hash_id";');
    this.addSql('alter table "person_resource" drop column "resource_hash_id";');
    this.addSql('alter table "person_resource" drop column "person_hash_id";');
    this.addSql('alter table "person_resource" add constraint "person_resource_resource_country_acronym_resource__13f13_unique" unique ("resource_country_acronym", "resource_uuid", "person_uuid");');
    this.addSql('alter table "person_resource" add constraint "person_resource_pkey" primary key ("uuid");');

    this.addSql('alter table "address"."country" add column "uuid" uuid not null default uuid_generate_v4(), add column "resource_uuid" uuid not null;');
    this.addSql('alter table "address"."country" drop constraint "country_pkey";');
    this.addSql('alter table "address"."country" add constraint "country_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;');
    this.addSql('alter table "address"."country" drop column "hash_id";');
    this.addSql('alter table "address"."country" drop column "resource_hash_id";');
    this.addSql('alter table "address"."country" add constraint "country_resource_country_acronym_resource_uuid_code_unique" unique ("resource_country_acronym", "resource_uuid", "code");');
    this.addSql('alter table "address"."country" add constraint "country_pkey" primary key ("uuid");');

    this.addSql('alter table "contact" add column "uuid" uuid not null default uuid_generate_v4(), add column "resource_uuid" uuid not null, add column "person_uuid" uuid not null;');
    this.addSql('alter table "contact" drop constraint "contact_resource_country_acronym_resource_hash_id__537f9_unique";');
    this.addSql('alter table "contact" drop constraint "contact_pkey";');
    this.addSql('alter table "contact" add constraint "contact_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;');
    this.addSql('alter table "contact" add constraint "contact_person_uuid_foreign" foreign key ("person_uuid") references "person" ("uuid") on update cascade;');
    this.addSql('alter table "contact" drop column "hash_id";');
    this.addSql('alter table "contact" drop column "resource_hash_id";');
    this.addSql('alter table "contact" drop column "person_hash_id";');
    this.addSql('alter table "contact" add constraint "contact_resource_country_acronym_resource_uuid_per_759d7_unique" unique ("resource_country_acronym", "resource_uuid", "person_uuid", "extra_key");');
    this.addSql('alter table "contact" add constraint "contact_pkey" primary key ("uuid");');

    this.addSql('alter table "address"."state" add column "uuid" uuid not null default uuid_generate_v4(), add column "resource_uuid" uuid not null;');
    this.addSql('alter table "address"."state" drop constraint "state_pkey";');
    this.addSql('alter table "address"."state" add constraint "state_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;');
    this.addSql('alter table "address"."state" drop column "hash_id";');
    this.addSql('alter table "address"."state" drop column "resource_hash_id";');
    this.addSql('alter table "address"."state" add constraint "state_resource_country_acronym_resource_uuid_code_unique" unique ("resource_country_acronym", "resource_uuid", "code");');
    this.addSql('alter table "address"."state" add constraint "state_pkey" primary key ("uuid");');

    this.addSql('alter table "address"."city" add column "uuid" uuid not null default uuid_generate_v4(), add column "resource_uuid" uuid not null, add column "state_uuid" uuid null;');
    this.addSql('alter table "address"."city" drop constraint "city_pkey";');
    this.addSql('alter table "address"."city" add constraint "city_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;');
    this.addSql('alter table "address"."city" add constraint "city_state_uuid_foreign" foreign key ("state_uuid") references "address"."state" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "address"."city" drop column "hash_id";');
    this.addSql('alter table "address"."city" drop column "resource_hash_id";');
    this.addSql('alter table "address"."city" drop column "state_hash_id";');
    this.addSql('alter table "address"."city" add constraint "city_resource_country_acronym_resource_uuid_code_unique" unique ("resource_country_acronym", "resource_uuid", "code");');
    this.addSql('alter table "address"."city" add constraint "city_pkey" primary key ("uuid");');

    this.addSql('alter table "establishment" add column "uuid" uuid not null default uuid_generate_v4(), add column "resource_uuid" uuid not null, add column "person_uuid" uuid not null, add column "country_uuid" uuid null, add column "city_uuid" uuid null;');
    this.addSql('alter table "establishment" drop constraint "establishment_resource_country_acronym_resource_ha_12617_unique";');
    this.addSql('alter table "establishment" drop constraint "establishment_pkey";');
    this.addSql('alter table "establishment" add constraint "establishment_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;');
    this.addSql('alter table "establishment" add constraint "establishment_person_uuid_foreign" foreign key ("person_uuid") references "person" ("uuid") on update cascade;');
    this.addSql('alter table "establishment" add constraint "establishment_country_uuid_foreign" foreign key ("country_uuid") references "address"."country" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "establishment" add constraint "establishment_city_uuid_foreign" foreign key ("city_uuid") references "address"."city" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "establishment" drop column "hash_id";');
    this.addSql('alter table "establishment" drop column "resource_hash_id";');
    this.addSql('alter table "establishment" drop column "person_hash_id";');
    this.addSql('alter table "establishment" drop column "country_hash_id";');
    this.addSql('alter table "establishment" drop column "city_hash_id";');
    this.addSql('alter table "establishment" add constraint "establishment_resource_country_acronym_resource_uu_d04cc_unique" unique ("resource_country_acronym", "resource_uuid", "person_uuid", "extra_key");');
    this.addSql('alter table "establishment" add constraint "establishment_pkey" primary key ("uuid");');

    this.addSql('alter table "partner" add column "uuid" uuid not null default uuid_generate_v4(), add column "resource_uuid" uuid not null, add column "establishment_uuid" uuid not null;');
    this.addSql('alter table "partner" drop constraint "partner_resource_country_acronym_resource_hash_id__8fb37_unique";');
    this.addSql('alter table "partner" drop constraint "partner_pkey";');
    this.addSql('alter table "partner" add constraint "partner_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;');
    this.addSql('alter table "partner" add constraint "partner_establishment_uuid_foreign" foreign key ("establishment_uuid") references "establishment" ("uuid") on update cascade;');
    this.addSql('alter table "partner" drop column "hash_id";');
    this.addSql('alter table "partner" drop column "resource_hash_id";');
    this.addSql('alter table "partner" drop column "establishment_hash_id";');
    this.addSql('alter table "partner" add constraint "partner_resource_country_acronym_resource_uuid_est_38788_unique" unique ("resource_country_acronym", "resource_uuid", "establishment_uuid", "extra_key");');
    this.addSql('alter table "partner" add constraint "partner_pkey" primary key ("uuid");');

    this.addSql('alter table "type_key_value" add column "uuid" uuid not null default uuid_generate_v4(), add column "resource_uuid" uuid not null;');
    this.addSql('alter table "type_key_value" drop constraint "type_key_value_resource_country_acronym_resource_h_2777d_unique";');
    this.addSql('alter table "type_key_value" drop constraint "type_key_value_pkey";');
    this.addSql('alter table "type_key_value" add constraint "type_key_value_resource_uuid_foreign" foreign key ("resource_uuid") references "resource" ("uuid") on update cascade;');
    this.addSql('alter table "type_key_value" drop column "hash_id";');
    this.addSql('alter table "type_key_value" drop column "resource_hash_id";');
    this.addSql('alter table "type_key_value" add constraint "type_key_value_resource_country_acronym_resource_u_ab2ab_unique" unique ("resource_country_acronym", "resource_uuid", "type", "key");');
    this.addSql('alter table "type_key_value" add constraint "type_key_value_pkey" primary key ("uuid");');
  }

}
