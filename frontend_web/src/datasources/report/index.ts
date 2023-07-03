import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

type RelEstabByMMAndStateCrosstabData = {
  date: string;
  ac: number;
  al: number;
  am: number;
  ap: number;
  ba: number;
  ce: number;
  df: number;
  es: number;
  ex: number;
  go: number;
  ma: number;
  mg: number;
  ms: number;
  mt: number;
  pa: number;
  pb: number;
  pe: number;
  pi: number;
  pr: number;
  rj: number;
  rn: number;
  ro: number;
  rr: number;
  rs: number;
  sc: number;
  se: number;
  sp: number;
  to: number;
};

export type RelEstabByMMAndStateList = Array<{ beginDate: string; stateCode: string; total: number }>;
export type RelEstabByMMAndStateCrosstabList = Array<RelEstabByMMAndStateCrosstabData>;
export type RelEstabByMMAndNatureList = Array<{ beginDate: string; natureCode: string; nature: string; total: number }>;
export type RelEstabByMMAndMainActivityList = Array<{ beginDate: string; mainActivity: string; total: number }>;

interface RelEstablishmentDataSourceI {
  // Relatório com total de empresas por mes e estado
  totalByMonthAndState(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndStateList>>;

  // Relatório com total de empresas por mes e estado
  totalByMonthAndStateCrosstab(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndStateCrosstabList>>;

  // Relatório com total de empresas por mes e natureza
  totalByMonthAndNature(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndNatureList>>;

  // Relatório com total de empresas por mes tipo de atividade
  totalByMonthAndActivity(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndMainActivityList>>;
}

export class RelEstablishmentDataSource implements RelEstablishmentDataSourceI {
  async totalByMonthAndState(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndStateList>> {
    return await Apis.ApiRelEstablishment.get(`${Endpoints.eRelEstablishmentTotalByMonthState}`, {
      params: { months },
    });
  }

  async totalByMonthAndStateCrosstab(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndStateCrosstabList>> {
    return await Apis.ApiRelEstablishment.get(`${Endpoints.eRelEstablishmentTotalByMonthStateCrosstab}`, {
      params: { months },
    });
  }

  async totalByMonthAndNature(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndNatureList>> {
    return await Apis.ApiRelEstablishment.get(`${Endpoints.eRelEstablishmentTotalByMonthNature}`, {
      params: { months },
    });
  }

  async totalByMonthAndActivity(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndMainActivityList>> {
    return await Apis.ApiRelEstablishment.get(`${Endpoints.eRelEstablishmentTotalByMonthMainActivity}`, {
      params: { months },
    });
  }
}
