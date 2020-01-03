import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormQuestionController } from './question.controller';
import { FormQuestion } from './question.entity';
import { FormQuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormQuestion])],
  providers: [FormQuestionService],
  controllers: [FormQuestionController],
  exports: [FormQuestionService],
})
export class FormQuestionModule {}
