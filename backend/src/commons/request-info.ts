import { Request } from 'express';
import { IdTokenInfo } from 'src/app/auth/passaport/iam.info';

export type RequestInfo = {
  //
  user: IdTokenInfo;
} & Request;
