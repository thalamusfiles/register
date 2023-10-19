import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Knex, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { City } from '../../../model/Address/City';
import { Contact } from '../../../model/Contact';
import { Establishment } from '../../../model/Establishment';
import { Person } from '../../../model/Person';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly knex: Knex;

  private readonly contTableName;
  private readonly persTableName;
  private readonly estTableName;

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
  }

  /**
   * Busca contatos
   */
  async findContacts(businessType: string, cityCode: string, limit: number, offset: number): Promise<Contact[]> {
    this.logger.verbose(`findContacts ${businessType} and ${cityCode}`);

    const city = await this.cityRepo.findOneOrFail({ code: cityCode }, { fields: ['hashId'] });

    limit = limit > 1000 ? 1000 : limit;
    offset = offset || 0;

    const query = this.knex
      .select('e.main_activity')
      .select('e.extra_key as document')
      .select('p.name')
      .select('c.phone')
      .select('c.email')
      .select('c.fax')
      .from(`${this.estTableName} as e`)
      .innerJoin(`${this.contTableName} as c`, `c.person_hash_id`, `e.person_hash_id`)
      .innerJoin(`${this.persTableName} as p`, `p.hash_id`, `e.person_hash_id`)
      .where('e.city_hash_id', city.hashId)
      .andWhere('e.main_activity', businessType)
      .orderBy('p.name')
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
