import { Controller, Get, Logger, Request, Res, UseGuards } from '@nestjs/common';
import authConfig from '../../../config/auth.config';
import cookieConfig from '../../../config/cookie.config';
import registerConfig from '../../../config/register.config';
import { IamGuard } from '../passaport/iam.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor() {
    this.logger.log('starting');
  }

  /**
   * Realiza o login via Oauth IAM
   * @param body
   * @returns
   */
  @Get('iam')
  @UseGuards(IamGuard)
  async iam() {
    this.logger.log('IAM Redirect');
    // do nothing
  }

  /**
   * Retorno da chamada do IAM com a chave de autorização
   * Com a chave de autorização é coletado o token do usuário.
   * @param body
   * @returns
   */
  @Get('iam/callback')
  @UseGuards(IamGuard)
  async iamCallback(@Request() request, @Res() response): Promise<any> {
    this.logger.log('IAM Callback');

    if (request.session[cookieConfig.NAME]) {
      request.session[cookieConfig.NAME][authConfig.TOKEN_HEADER_NAME] = request.user.idToken;
    } else {
      request.session[cookieConfig.NAME] = { [authConfig.TOKEN_HEADER_NAME]: request.user.idToken };
    }

    return response.redirect((registerConfig.PRODCTION_MODE ? '' : registerConfig.DEV_URL) + '/public/app/tokenload');
  }

  /**
   * Coleta o token salvo na sessão
   * @param body
   * @returns
   */
  @Get('token')
  async token(@Request() req): Promise<any> {
    this.logger.log('Get Token');

    const idToken = (req.session[cookieConfig.NAME] || {})[authConfig.TOKEN_HEADER_NAME];

    if (idToken) {
      const payload = idToken.split('.')[1];
      const userInfo = JSON.parse(Buffer.from(payload, 'base64').toString());

      return { idToken, userInfo };
    }
    return null;
  }

  /**
   * Inviabiliza o token de acesso no banco.
   * Desloga o usuário da sessão
   */
  @Get('logout')
  async logout(@Request() request, @Res() response): Promise<void> {
    this.logger.log('Logout');

    request.session.destroy();

    return response.redirect(registerConfig.PRODCTION_MODE ? '/' : `${registerConfig.DEV_URL}/`);
  }
}
