import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormQuestionModule } from '../form-question/question.module';
import { FormController } from './form.controller';
import { Form } from './form.entity';
import { FormService } from './form.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form]), FormQuestionModule],
  providers: [FormService],
  controllers: [FormController],
  exports: [FormService],
})
export class FormModule {}
