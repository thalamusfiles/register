export class IdTokenInfo {
  iss: string;
  // Created at
  iat: number;
  // Expires In
  exp?: number;

  sub: string; /*sub*/

  name: string;
  //Aplication / ClientId
  aud: string;
}

export class IAMInfo {
  idToken: string;
  accessToken: string; /*sub*/
  userinfo: IdTokenInfo;
}
