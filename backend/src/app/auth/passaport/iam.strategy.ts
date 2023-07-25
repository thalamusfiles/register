import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, Issuer, TokenSet } from 'openid-client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import authConfig from '../../../config/auth.config';
import cookieConfig from '../../../config/cookie.config';

export const buildIamOpenIdClient = async (): Promise<Client | null> => {
  const TrustIssuer = await Issuer.discover(`${authConfig.OAUTH_URL}`).catch(() => null);
  if (!TrustIssuer) return null;

  const client = new TrustIssuer.Client({
    authorization_signed_response_alg: 'HS256', //TODO: implementar RS256
    id_token_signed_response_alg: 'HS256', //TODO: implementar RS256
    client_id: authConfig.CLIENT_ID,
    client_secret: authConfig.CLIENT_SECRET,
  });

  return client;
};

@Injectable()
export class IamStrategy extends PassportStrategy(Strategy, 'iam') {
  constructor(private readonly client: Client) {
    super({
      client: client,
      params: {
        redirect_uri: authConfig.OAUTH_CALLBACK,
        client_id: authConfig.CLIENT_ID,
        client_secret: authConfig.CLIENT_SECRET,
        response_type: 'code',
        scope: authConfig.OAUTH_SCOPE,
      },
      sessionKey: cookieConfig.NAME,
      usePKCE: true,
    });
  }

  async validate(tokenset: TokenSet): Promise<any> {
    //const userinfo = await this.client.userinfo(tokenset);
    console.log(tokenset);

    try {
      const id_token = tokenset.id_token;
      const access_token = tokenset.access_token;
      const refresh_token = tokenset.refresh_token;
      const user = {
        id_token,
        access_token,
        refresh_token,
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
    const client = await buildIamOpenIdClient();
    if (!client) return null;

    const strategy = new IamStrategy(client);
    return strategy;
  },
};
