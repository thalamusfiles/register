import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type TokenDto = { idToken: string; userInfo: any };

interface AuthDataSourceI {
  // Coleta o token de acesso
  getToken(): Promise<AxiosResponse<TokenDto>>;
}

export class AuthDataSource implements AuthDataSourceI {
  async getToken(): Promise<AxiosResponse<TokenDto>> {
    return await Apis.ApiAuth.get(`${Endpoints.eAuthToken}`);
  }
}
