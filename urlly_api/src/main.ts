import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';

let port = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(helmet());
  app.use(compression());
  app.enableCors();
  port = process.env.PORT ? +process.env.PORT : 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap()
  .then(() => {
    console.log(`Server running on http://localhost:${port}`);
  })
  .catch(console.error);
