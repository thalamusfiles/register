import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import createNestLogger from './app/logger/create-logger';
import { NotFoundExceptionFilter } from './commons/catch.exception';
import registerConfig from './config/register.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createNestLogger(),
  });

  const config = new DocumentBuilder().setTitle('Thalamus Register Swagger').setDescription('All endpoints are available on swagger ').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Filtro de exceção do ORM
  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(registerConfig.PORT);
}
bootstrap();
