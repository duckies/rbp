<<<<<<< HEAD
import { Module } from '@nestjs/common';
=======
import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { FormQuestion } from '../form-question/question.entity';
import { FormQuestionService } from '../form-question/question.service';
import { FormSubmissionReadModule } from '../form-submission-seen/form-submission-read.module';
<<<<<<< HEAD
import { SubmissionController } from './form-submission.controller';
import { FormSubmission } from './form-submission.entity';
import { SubmissionService } from './form-submission.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormSubmission, FormQuestion]), FormSubmissionReadModule, BlizzardModule],
  providers: [SubmissionService, FormQuestionService],
=======
import { RaiderIOModule } from '../raiderIO/raiderIO.module';
import { SubmissionController } from './form-submission.controller';
import { FormSubmission } from './form-submission.entity';
import { FormSubmissionQueue } from './form-submission.queue';
import { SubmissionService } from './form-submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormSubmission, FormQuestion]),
    BullModule.registerQueue({ name: 'form' }),
    HttpModule,
    FormSubmissionReadModule,
    BlizzardModule,
    RaiderIOModule,
  ],
  providers: [SubmissionService, FormQuestionService, FormSubmissionQueue],
>>>>>>> e48f288102f35f9231847af734197ed6d73ac028
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class FormSubmissionModule {}
