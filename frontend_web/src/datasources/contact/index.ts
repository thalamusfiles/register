import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type ContactList = Array<any>;

interface ContactDataSourceI {
  // Busca os estabelecimentos de um determinado tipo de empresa (CNAE)
  find(businessType: string[], cityCode: string, limit: number, offset: number): Promise<AxiosResponse<ContactList>>;

  // Busca os estabelecimentos de um determinado tipo de empresa aleatório
  findRandom(limit: number, offset: number): Promise<AxiosResponse<ContactList>>;
}

export class ContactDataSource implements ContactDataSourceI {
  async find(businessType: string[], cityCode: string, limit: number, offset: number): Promise<AxiosResponse<ContactList>> {
    return await Apis.ApiContact.get(`${Endpoints.eContactFind}`, {
      params: { businessType, cityCode, limit, offset },
    });
  }

  async findRandom(limit: number, offset: number): Promise<AxiosResponse<ContactList>> {
    return await Apis.ApiContact.get(`${Endpoints.eContactFindRandom}`, {
      params: { limit, offset },
    });
  }
}
