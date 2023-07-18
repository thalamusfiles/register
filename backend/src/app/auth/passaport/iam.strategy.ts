import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, Issuer, TokenSet } from 'openid-client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import authConfig from '../../../config/auth.config';
import cookieConfig from '../../../config/cookie.config';

export const buildIamOpenIdClient = async (): Promise<Client> => {
  const TrustIssuer = await Issuer.discover(`${authConfig.OAUTH_URL}${authConfig.OAUTH_AUTHORIZE}`);
  const client = new TrustIssuer.Client({
    client_id: authConfig.CLIENT_ID,
    client_secret: cookieConfig.SECRET,
  });
  return client;
};

@Injectable()
export class IamStrategy extends PassportStrategy(Strategy, 'iam') {
  constructor(private readonly client: Client) {
    super({
      client: '' as any,
      params: {
        redirect_uri: authConfig.OAUTH_CALLBACK,
        client_id: authConfig.CLIENT_ID,
        scope: authConfig.OAUTH_SCOPE,
      },
      usePKCE: true,
    });
  }

  async validate(tokenset: TokenSet): Promise<any> {
    const userinfo = await this.client.userinfo(tokenset);

    try {
      const id_token = tokenset.id_token;
      const access_token = tokenset.access_token;
      const refresh_token = tokenset.refresh_token;
      const user = {
        id_token,
        access_token,
        refresh_token,
        userinfo,
      };
      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}

export const IamStrategyFactory = {
  provide: 'IamStrategy',
  useFactory: async () => {
    const client = await buildIamOpenIdClient(); // secret sauce! build the dynamic client before injecting it into the strategy for use in the constructor super call.
    const strategy = new IamStrategy(client);
    return strategy;
  },
};
