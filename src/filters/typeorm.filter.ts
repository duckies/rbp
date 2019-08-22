import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import {UpdateValuesMissingError} from 'typeorm/error/UpdateValuesMissingError';
import { QueryFailedError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    response.status(404).send({ message: exception.message });
  }
}

@Catch(UpdateValuesMissingError)
export class UpdateValuesMissingExceptionFilter implements ExceptionFilter {
  catch(exception: UpdateValuesMissingError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    
    response.status(400).send({ message: 'No update values defined.' });
  }
}

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    switch (exception.code) {
      // Unique Constraint Violation
      case '23505':
        response.status(400).send({ message: 'Duplicate entry.', error: exception.message })
        break;
      // Foreign Key Violation
      case '23503':
        response.status(404).send({ message: 'Foreign key constraint', error: exception.message })
        break;

      default:
        response.status(500).send({ error: exception })
        break;
    }
  }
}