import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import authConfig from '../../../config/auth.config';
import { RequestInfo } from '../../../commons/request-info';
import { IdTokenInfo } from './iam.info';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AccessStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.CLIENT_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: RequestInfo, auth: IdTokenInfo): Promise<Partial<IdTokenInfo>> {
    return {
      iss: auth.iss,
      iat: auth.iat,
      sub: auth.sub,
      name: auth.name,
      aud: auth.aud,
      exp: auth.exp,
    };
  }
}
