import { Controller, Get, Logger, Query, Request, UseGuards } from '@nestjs/common';
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
    this.logger.log('callback');
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
  async callback(@Request() request, @Query() query?: { code: string; state: string }): Promise<any> {
    this.logger.log('callback');

    return { code: query.code, state: query.state };
  }
}
