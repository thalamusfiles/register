import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type ZipCodeList = Array<any>;

interface EstablishmentDataSourceI {
  // Busca os estabelecimentos em determinado zipcode
  findByZipcode(zipcode: string, limit: number, offset: number): Promise<AxiosResponse<ZipCodeList>>;

  // Busca os estabelecimentos de um zipcode aleatório
  findByZipcodeRandom(limit: number, offset: number): Promise<AxiosResponse<ZipCodeList>>;

  // Busca os estabelecimentos de um determinado tipo de empresa (CNAE)
  findByBusinessType(businessType: string, cityCode: string, limit: number, offset: number): Promise<AxiosResponse<ZipCodeList>>;
}

export class EstablishmentDataSource implements EstablishmentDataSourceI {
  async findByZipcode(zipcode: string, limit: number, offset: number): Promise<AxiosResponse<ZipCodeList>> {
    return await Apis.ApiEstablishment.get(`${Endpoints.eEstablishmentZipcode}`, {
      params: { zipcode, limit, offset },
    });
  }

  async findByZipcodeRandom(limit: number, offset: number): Promise<AxiosResponse<ZipCodeList>> {
    return await Apis.ApiEstablishment.get(`${Endpoints.eEstablishmentZipcodeRandom}`, {
      params: { limit, offset },
    });
  }

  async findByBusinessType(businessType: string, cityCode: string, limit: number, offset: number): Promise<AxiosResponse<ZipCodeList>> {
    return await Apis.ApiEstablishment.get(`${Endpoints.eEstablishmentBusinessType}`, {
      params: { businessType, cityCode, limit, offset },
    });
  }
}
