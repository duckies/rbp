import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import {
  EntityNotFoundExceptionFilter,
  UpdateValuesMissingExceptionFilter,
  QueryFailedExceptionFilter,
} from './filters/typeorm.filter';
import { useContainer } from 'typeorm';
import { BlizzardExceptionFilter } from './filters/blizzard.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:8000',
    allowedHeaders: ['Authorization'],
    credentials: true
  });

  // app.useGlobalFilters(new BlizzardExceptionFilter());
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalFilters(new UpdateValuesMissingExceptionFilter());
  app.useGlobalFilters(new QueryFailedExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}

bootstrap();
