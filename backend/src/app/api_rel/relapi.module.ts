import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, NestModule } from '@nestjs/common';
import RelEstablishmentByMonthAndState from '../../model/Materialized/RelEstablishmentByMonthAndState';
import RelEstablishmentByMonthAndStateCrossTab from '../../model/Materialized/RelEstablishmentByMonthAndStateCrossTab';
import { RelEstablishmentController } from './controller/relestablishment.controller';
import { RelEstablishmentService } from './service/relestablishment.repository';

@Module({
  imports: [MikroOrmModule.forFeature([RelEstablishmentByMonthAndState, RelEstablishmentByMonthAndStateCrossTab])],
  providers: [RelEstablishmentService],
  controllers: [
    //
    RelEstablishmentController,
  ],
})
export class RelApiModule implements NestModule {
  private readonly logger = new Logger(RelApiModule.name);

  configure() {
    this.logger.log('configure');
  }
}
