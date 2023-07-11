import { Controller, Get, Logger, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import authConfig from '../../../config/auth.config';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor() {
    this.logger.log('starting');
  }

  /**
   * Realiza o login via sistema IAM
   * @param body
   * @returns
   */
  @Get('iam')
  @UsePipes(new RegisterValidationPipe())
  async login(@Res() response: Response): Promise<any> {
    this.logger.log('Login Local');

    const url = authConfig.AUTH_URL + authConfig.AUTH_URL_PATH;

    return response.redirect(url.replace(':clienteId', authConfig.APP_REGISTER_ID));
  }

  /**
   * Retorno da chamada do IAM com a chave de autorização
   * Com a chave de autorização é coletado o token do usuário.
   * @param body
   * @returns
   */
  @Get('iam/callback')
  @UsePipes(new RegisterValidationPipe())
  async callback(): Promise<any> {
    this.logger.log('Login Local');

    return { callback: true };
  }
}
