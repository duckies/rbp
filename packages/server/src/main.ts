import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { ConfigService } from './config/config.service.js';
import Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const config = app.get(ConfigService);

  await app.listen(3000);

  /**
   * Initialize Sentry error reporting.
   */
  // if (config.SENTRY.DSN) {
  //   Sentry.init({
  //     dsn: config.SENTRY.DSN,
  //     environment: config.SENTRY.ENVIRONMENT,
  //     integrations: [
  //       // enable HTTP calls tracing
  //       new Sentry.Integrations.Http({ tracing: true }),
  //     ],
  //   });
  // }

  // /**
  //  * Whitelist all arguments so they must be described in a DTO.
  //  * ForbidNonWhitelisted to not allow requests with extraneous information.
  //  */
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  // /**
  //  * Allows for external communication as this is an API-based backend.
  //  */
  // app.enableCors();

  // /**
  //  * Instructs NestJS to listen to shutdown signals.
  //  */
  // app.enableShutdownHooks();

  // await app.listen(config.PORT);
}

bootstrap();
