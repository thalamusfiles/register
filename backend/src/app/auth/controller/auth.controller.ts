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
  @Get('login')
  @UsePipes(new RegisterValidationPipe())
  async login(@Res({ passthrough: true }) response: Response): Promise<any> {
    this.logger.log('Login Local');

    const url = authConfig.AUTH_URL + authConfig.AUTH_URL_PATH;

    return response.redirect(url.replace(':clienteId', authConfig.APP_REGISTER_ID));
  }
}
