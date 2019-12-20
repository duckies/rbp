import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';

export class BlizzardExceptionFilter implements ExceptionFilter {
  catch(exception: NodeJS.ErrnoException, host: ArgumentsHost): void {
    const resp = host.switchToHttp().getResponse();

    if (exception.name === 'TokenError' && exception.code === 'invalid_grant') {
      return resp.status(401).send({ message: 'Authorization code received from Blizzard is not valid.' });
    }
    if (exception.errno === 401) {
      return resp.status(401).send({ message: 'Token is invalid or expired.' });
    }

    return resp.status(500).send({ exception });
  }
}
