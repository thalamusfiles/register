import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type StateList = Array<{ uuid: string; code: string; name: string }>;
export type CityList = Array<{ uuid: string; code: string; name: string }>;

interface AddressDataSourceI {
  // Busca os estados
  findState(): Promise<AxiosResponse<StateList>>;

  // Busca os estados
  findCity(stateCode: string): Promise<AxiosResponse<CityList>>;
}

export class AddressDataSource implements AddressDataSourceI {
  async findState(): Promise<AxiosResponse<StateList>> {
    return await Apis.ApiAddress.get(`${Endpoints.eAddressState}`);
  }

  async findCity(stateCode: string): Promise<AxiosResponse<CityList>> {
    return await Apis.ApiAddress.get(`${Endpoints.eAddressCity}`, {
      params: { stateCode },
    });
  }
}
