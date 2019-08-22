import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  EntityNotFoundExceptionFilter,
  UpdateValuesMissingExceptionFilter,
  QueryFailedExceptionFilter,
} from './filters/typeorm.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalFilters(new UpdateValuesMissingExceptionFilter());
  app.useGlobalFilters(new QueryFailedExceptionFilter());
  await app.listen(3000);
}
bootstrap();
