import { Logger, Module, NestModule } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { IamStrategyFactory } from './passaport/iam.strategy';

@Module({
  providers: [IamStrategyFactory],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  private readonly logger = new Logger(AuthModule.name);

  configure() {
    this.logger.log('configure');
  }
}
