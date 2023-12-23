import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { City } from '../../../model/Address/City';
import { Contact } from '../../../model/Contact';
import { Establishment } from '../../../model/Establishment';
import { Person } from '../../../model/Person';
import { Partner } from '../../../model/Partner';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly knex: Knex;

  private readonly contTableName;
  private readonly persTableName;
  private readonly estTableName;
  private readonly partTableName;

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: EntityRepository<Contact>,
    @InjectRepository(City)
    private readonly cityRepo: EntityRepository<City>,
  ) {
    this.logger.log('Starting');

    this.knex = (this.contactRepo.getEntityManager().getConnection('read') as PostgreSqlConnection).getKnex();

    this.contTableName = this.contactRepo.getEntityManager().getMetadata().get(Contact.name).tableName;
    this.persTableName = this.contactRepo.getEntityManager().getMetadata().get(Person.name).tableName;
    this.estTableName = this.contactRepo.getEntityManager().getMetadata().get(Establishment.name).tableName;
    this.partTableName = this.contactRepo.getEntityManager().getMetadata().get(Partner.name).tableName;
  }

  /**
   * Busca contatos
   */
  async findContacts(businessType: string, cityCode: string, limit: number, offset: number): Promise<any[]> {
    this.logger.verbose(`findContacts ${businessType} and ${cityCode}`);

    const city = await this.cityRepo.findOneOrFail({ code: cityCode }, { fields: ['hashId'] });

    limit = limit > 1000 ? 1000 : limit;
    offset = offset || 0;

    const query = this.knex
      .select('est.extra_key as document')
      .select('est.zipcode')
      .select('est.main_activity')
      .select('est.other_activities')
      .select('pers.name')
      .select('cont.phone')
      .select('cont.email')
      .select('cont.fax')
      .select(`part.partner`)
      .select(`part.representative_name`)
      .from(`${this.estTableName} as est`)
      .leftJoin(`${this.persTableName} as pers`, `pers.hash_id`, `est.person_hash_id`)
      .leftJoin(`${this.contTableName} as cont`, `cont.person_hash_id`, `est.person_hash_id`)
      .leftJoin(`${this.partTableName} as part`, `part.establishment_hash_id`, `est.hash_id`)
      .where('est.city_hash_id', city.hashId)
      .andWhere('est.main_activity', businessType)
      .orderBy('pers.name')
      .limit(limit)
      .offset(offset);

    return await query;
  }

  /**
   * Busca registro de contatos aleatório
   */
  async findContactsRandom(limit: number, offset: number): Promise<Contact[]> {
    this.logger.verbose('findContactsRandom');

    const randomize = 'TABLESAMPLE SYSTEM (1)';

    const query = this.knex
      .select('city_hash_id')
      .select('main_activity')
      .from(this.knex.raw(`${this.estTableName} ${randomize}`))
      .limit(1)
      .first();

    const rs = await query;

    if (rs) {
      const { main_activity, city_hash_id } = rs;
      const city = await this.cityRepo.findOneOrFail({ hashId: city_hash_id }, { fields: ['code'] });

      return this.findContacts(main_activity, city.code, limit, offset);
    }
    return null;
  }
}
