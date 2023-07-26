import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import createNestLogger from './app/logger/create-logger';
import { NotFoundExceptionFilter } from './commons/catch.exception';
import registerConfig from './config/register.config';
import * as session from 'express-session';
import cookieConfig from './config/cookie.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createNestLogger(),
  });

  const config = new DocumentBuilder().setTitle('Thalamus Register Swagger').setDescription('All endpoints are available on swagger ').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Filtro de exceção do ORM
  app.useGlobalFilters(new NotFoundExceptionFilter());

  // somewhere in your initialization file
  app.use(
    session({
      secret: cookieConfig.SECRET,
      name: cookieConfig.NAME,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: cookieConfig.HTTP_ONLY,
        sameSite: cookieConfig.SAME_SITE as false | undefined,
        maxAge: cookieConfig.MAX_AGE,
        path: cookieConfig.PATH,
      },
    }),
  );

  if (!registerConfig.PRODCTION_MODE) {
    app.enableCors({
      origin: registerConfig.DEV_URL,
      credentials: true,
    });
  }

  await app.listen(registerConfig.PORT);
}
bootstrap();
