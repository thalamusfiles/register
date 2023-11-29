import { Logger } from '@nestjs/common';

export abstract class BaseController {
  protected abstract readonly logger: Logger;

  protected logBeforeReturn<Resp>(resp: Resp, msg: string, context: any, user: string | null): Resp {
    if (user) {
      context.user = user;
    }
    this.logger.log(msg, context);

    return resp;
  }
}
