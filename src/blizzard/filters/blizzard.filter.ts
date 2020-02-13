import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

/**
 * Exceptions thrown by Blizzard can be proxied through our requests.
 */

export class BlizzardFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost): Response {
    const resp: Response = host.switchToHttp().getResponse();

    if (
      exception.config &&
      exception.config.url &&
      (exception.config.url.includes('blizzard.com') || exception.config.url.includes('battle.net'))
    ) {
      return resp.status(exception.response.status).send(exception.response.data);
    }

    console.error(exception);
    return resp.status(500).send({ exception });
  }
}
