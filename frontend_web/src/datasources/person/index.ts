import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type PersonFindByDocumentRespDto = {
  key: string;
  brGovDados: Record<string, string | number>;
};

interface PersonDataSourceI {
  // Busca o registro da pessoa jurídica pelo identificador do documento
  findLegalByDocument(document: string): Promise<AxiosResponse<PersonFindByDocumentRespDto>>;
  // Busca um registro aleatório de pessoa jurídica
  findLegalRandom(document: string): Promise<AxiosResponse<PersonFindByDocumentRespDto>>;

  // Busca o registro da pessoa física pelo identificador do documento
  findNaturalByDocument(document: string): Promise<AxiosResponse<PersonFindByDocumentRespDto>>;
}

export class PersonDataSource implements PersonDataSourceI {
  async findLegalByDocument(document: string): Promise<AxiosResponse<PersonFindByDocumentRespDto>> {
    return await Apis.ApiPerson.get(`${Endpoints.apiPersonLegal}`, {
      params: { document },
    });
  }
  async findLegalRandom(): Promise<AxiosResponse<PersonFindByDocumentRespDto>> {
    return await Apis.ApiPerson.get(`${Endpoints.apiPersonLegalRandom}`);
  }

  async findNaturalByDocument(document: string): Promise<AxiosResponse<PersonFindByDocumentRespDto>> {
    return await Apis.ApiPerson.get(`${Endpoints.apiPersonNatural}`, {
      params: { document },
    });
  }
}
