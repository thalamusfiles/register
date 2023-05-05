import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import createNestLogger from './app/logger/create-logger';
import { NotFoundExceptionFilter } from './commons/catch.exception';
import registerConfig from './config/register.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createNestLogger(),
  });

  // Filtro de exceção do ORM
  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(registerConfig.PORT);
}
bootstrap();
