import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormSubmissionReadController } from './form-submission-read.controller';
import { FormSubmissionRead } from './form-submission-read.entity';
import { FormSubmissionReadService } from './form-submission-read.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormSubmissionRead])],
  providers: [FormSubmissionReadService],
  controllers: [FormSubmissionReadController],
  exports: [FormSubmissionReadService],
})
export class FormSubmissionReadModule {}
