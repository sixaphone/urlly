import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';

let port = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(helmet());
  app.use(compression());
  port = process.env.PORT ? +process.env.PORT : 3000;
  await app.listen(port);
}

bootstrap()
  .then(() => {
    console.log(`Server running on http://localhost:${port}`);
  })
  .catch(console.error);
