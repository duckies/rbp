import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { BlizzardFilter } from './blizzard/filters/blizzard.filter';
import {
  EntityNotFoundExceptionFilter,
  QueryFailedExceptionFilter,
  UpdateValuesMissingExceptionFilter,
} from './filters/typeorm.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * Whitelist all arguments so they must be described in a DTO.
   * ForbidNonWhitelisted to not allow requests with extraneous information.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * Transforms errors received by Postgres and Blizzard.
   *
   */
  app.useGlobalFilters(new BlizzardFilter());
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalFilters(new UpdateValuesMissingExceptionFilter());
  app.useGlobalFilters(new QueryFailedExceptionFilter());

  /**
   * Allows for communication from another domain or port.
   */
  // app.enableCors({
  //   origin: 'http://localhost:3030',
  //   allowedHeaders: ['Authorization', 'content-type'],
  //   credentials: true,
  // });
  app.enableCors();

  await app.listen(3000);
}

bootstrap();
