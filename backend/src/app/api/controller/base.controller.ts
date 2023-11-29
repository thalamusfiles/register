import { Logger } from '@nestjs/common';

export abstract class BaseController {
  protected abstract readonly logger: Logger;

  protected logBeforeReturn<Resp>(resp: Resp, msg: string, context: any): Resp {
    this.logger.log(msg, context);

    return resp;
  }
}
