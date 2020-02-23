import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { FormQuestion } from '../form-question/question.entity';
import { FormQuestionService } from '../form-question/question.service';
import { FormSubmissionReadModule } from '../form-submission-seen/form-submission-read.module';
import { RaiderIOModule } from '../raiderIO/raiderIO.module';
import { SubmissionController } from './form-submission.controller';
import { FormSubmission } from './form-submission.entity';
import { SubmissionService } from './form-submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormSubmission, FormQuestion]),
    FormSubmissionReadModule,
    BlizzardModule,
    RaiderIOModule,
  ],
  providers: [SubmissionService, FormQuestionService],
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class FormSubmissionModule {}
