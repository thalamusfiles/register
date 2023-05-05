import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import registerConfig from '../config/register.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend'),
      serveStaticOptions: {
        maxAge: registerConfig.STATIC_FILE_MAX_AGE,
      },
    }),
  ],
})
export class StaticFileModule {}
