import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../question/question.entity';
import { QuestionService } from '../question/question.service';
import { SubmissionController } from './submission.controller';
import { Submission } from './submission.entity';
import { SubmissionService } from './submission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Submission, Question])],
  providers: [SubmissionService, QuestionService],
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class SubmissionModule {}
