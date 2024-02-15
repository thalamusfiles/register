import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RequestInfo } from 'src/commons/request-info';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  async shouldSkip(_context: ExecutionContext): Promise<boolean> {
    const user = this.getRequestResponse(_context).req.user;
    return !!user.sub;
  }

  async getTracker(req: RequestInfo): Promise<string> {
    return req.user.sub || req.ip;
  }
}
