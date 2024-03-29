import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Endpoint from './endpoints';

class RegisterApisConfigure {
  token = '';
  ApiAuth!: AxiosInstance;
  ApiPerson!: AxiosInstance;
  ApiAddress!: AxiosInstance;
  ApiTypeKeyValue!: AxiosInstance;
  ApiEstablishment!: AxiosInstance;
  ApiContact!: AxiosInstance;
  ApiRelEstablishment!: AxiosInstance;

  /**
   * Intercepta todas as requisições
   * @param config
   */
  requestInterceptors = (config: any) => {
    if (this.token) config.headers.Authorization = 'Bearer ' + this.token;
    return config;
  };

  axiosStart = (config: AxiosRequestConfig): AxiosInstance => {
    const api = axios.create(config);
    api.interceptors.request.use(this.requestInterceptors);
    return api;
  };

  initApis = () => {
    this.ApiAuth = this.axiosStart({
      baseURL: Endpoint.eAuth!,
      timeout: Endpoint.timeout,
      withCredentials: true,
    });

    this.ApiPerson = this.axiosStart({
      baseURL: Endpoint.ePerson!,
      timeout: Endpoint.timeout,
    });

    this.ApiAddress = this.axiosStart({
      baseURL: Endpoint.eAddress!,
      timeout: Endpoint.timeout,
    });

    this.ApiTypeKeyValue = this.axiosStart({
      baseURL: Endpoint.eTypeKeyValue!,
      timeout: Endpoint.timeout,
    });

    this.ApiEstablishment = this.axiosStart({
      baseURL: Endpoint.eEstablishment!,
      timeout: Endpoint.timeout,
    });

    this.ApiContact = this.axiosStart({
      baseURL: Endpoint.eContact!,
      timeout: Endpoint.timeout,
    });

    // API Relatórios
    this.ApiRelEstablishment = this.axiosStart({
      baseURL: Endpoint.eRelEstablishment!,
      timeout: Endpoint.timeout,
    });
  };

  setGlobalAuthorizationToken = (newToken: string): void => {
    this.token = newToken;
  };

  configureConsumer = (baseUrl?: string, basePort?: string): void => {
    Endpoint.configureEndpoint(baseUrl, basePort);
    this.initApis();
  };
}

const Apis = new RegisterApisConfigure();
export default Apis;
