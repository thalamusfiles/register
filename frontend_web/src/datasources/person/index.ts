import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type PersonFindByDocumentRespDto = {
  key: string;
  brGovDados: Record<string, string | number>;
};
export type PartnerList = Array<any>;

interface PersonDataSourceI {
  // Busca o registro da pessoa jurídica pelo identificador do documento
  findLegalByDocument(document: string): Promise<AxiosResponse<PersonFindByDocumentRespDto>>;
  // Busca um registro aleatório de pessoa jurídica
  findLegalRandom(document: string): Promise<AxiosResponse<PersonFindByDocumentRespDto>>;

  // Busca o registro da pessoa física pelo identificador do documento
  findNaturalByDocument(document: string): Promise<AxiosResponse<PartnerList>>;

  // Busca o registro da pessoa física pelo identificador do documento
  findNaturalRandom(): Promise<AxiosResponse<PartnerList>>;
}

export class PersonDataSource implements PersonDataSourceI {
  async findLegalByDocument(document: string): Promise<AxiosResponse<PersonFindByDocumentRespDto>> {
    return await Apis.ApiPerson.get(`${Endpoints.ePersonLegal}`, {
      params: { document },
    });
  }
  async findLegalRandom(): Promise<AxiosResponse<PersonFindByDocumentRespDto>> {
    return await Apis.ApiPerson.get(`${Endpoints.ePersonLegalRandom}`);
  }

  async findNaturalByDocument(document: string): Promise<AxiosResponse<PartnerList>> {
    return await Apis.ApiPerson.get(`${Endpoints.ePersonNatural}`, {
      params: { document },
    });
  }

  async findNaturalRandom(): Promise<AxiosResponse<PartnerList>> {
    return await Apis.ApiPerson.get(`${Endpoints.ePersonNaturalRandom}`);
  }
}
