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

interface RelEstablishmentDataSourceI {
  // Relatório com total de empresas por mes e estado
  totalByMonthAndState(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndStateList>>;

  // Relatório com total de empresas por mes e estado
  totalByMonthAndStateCrosstab(months: Array<string>): Promise<AxiosResponse<RelEstabByMMAndStateCrosstabList>>;
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
}
