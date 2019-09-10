import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Request } from 'express';

export class BlizzardExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const resp = host.switchToHttp().getResponse();

    console.log(exception);

    if (exception.name === 'TokenError' && exception.code === 'invalid_grant') {
      return resp.status(401).send({ message: 'Authorization code received from Blizzard is not valid.' });
    } else if (exception.status == 401) {
      return resp.status(401).send({ message: 'Token is invalid or expired.' });
    }
    
    return resp.status(500).send({ exception });
  }
}