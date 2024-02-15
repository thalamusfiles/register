export class IdTokenInfo {
  iss: string;
  // Created at
  iat: number;
  // Expires In
  exp?: number;
  // Identificador usuário
  sub: string;

  name: string;
  //Aplication / ClientId
  aud: string;
}

export class IAMInfo {
  idToken: string;
  accessToken: string;
  userinfo: IdTokenInfo;
}
