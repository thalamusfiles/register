import { AxiosResponse } from 'axios';
import Apis from '../apis';
import Endpoints from '../endpoints';

export type BRCNAEList = Array<{ hashId: string; key: string; value: { description: string } }>;

interface TypeKeyValueDataSourceI {
  // Busca os estados
  findBRCNAES(): Promise<AxiosResponse<BRCNAEList>>;
}

export class TypeKeyValueDataSource implements TypeKeyValueDataSourceI {
  async findBRCNAES(): Promise<AxiosResponse<BRCNAEList>> {
    return await Apis.ApiTypeKeyValue.get(`${Endpoints.eTypeKeyValueBrCnae}`);
  }
}
