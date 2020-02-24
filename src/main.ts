import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { BlizzardFilter } from './blizzard/filters/blizzard.filter';
=======
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import {
  EntityNotFoundExceptionFilter,
  QueryFailedExceptionFilter,
  UpdateValuesMissingExceptionFilter,
<<<<<<< HEAD
} from './filters/typeorm.filter';
=======
} from './typeorm.filter';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

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
<<<<<<< HEAD
  // app.useGlobalFilters(new BlizzardFilter());
=======
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
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
