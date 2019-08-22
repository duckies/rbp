import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";

export class BlizzardExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const resp = host.switchToHttp().getResponse();

    console.log(exception);

    if (exception.name === 'TokenError' && exception.code === 'invalid_grant') {
      return resp.status(401).send({ message: 'Authorization code received from Blizzard is not valid.' });
    }
    
    return resp.status(500).send({ exception });
  }
}