import { HttpException, HttpStatus } from '@nestjs/common';
import { Question } from '../question.entity';

export class InvalidQuestionException extends HttpException {
  constructor(question: Question, message?: string | object, error = 'Bad Request') {
    super(
      HttpException.createBody(
        {
          question,
          message: message,
        },
        error,
        HttpStatus.BAD_REQUEST,
      ),
      HttpStatus.BAD_REQUEST,
    );
  }
}
