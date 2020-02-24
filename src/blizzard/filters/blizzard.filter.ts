import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { AxiosError } from 'axios';
<<<<<<< HEAD
import { Response } from 'express';
=======
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

/**
 * Exceptions thrown by Blizzard can be proxied through our requests.
 */

export class BlizzardFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost): Response {
<<<<<<< HEAD
    const resp: Response = host.switchToHttp().getResponse();
=======
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028

    if (
      exception.config &&
      exception.config.url &&
      (exception.config.url.includes('blizzard.com') || exception.config.url.includes('battle.net'))
    ) {
<<<<<<< HEAD
      return resp.status(exception.response.status).send(exception.response.data);
    }

    console.error(exception)
    return resp.status(500).send({ exception });
=======
      // console.error(exception);

      return response.status(exception.response.status).send({
        timestamp: new Date().toISOString(),
        path: exception.config.url,
        data: exception.response.data,
      });
    }

    throw exception;
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  }
}
