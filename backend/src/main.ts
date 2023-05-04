import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './commons/catch.exception';
import registerConfig from './config/register.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtro de exceção do ORM
  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(registerConfig.PORT);
}
bootstrap();
