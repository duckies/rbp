import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldModule } from '../field/field.module';
import { FormController } from './form.controller';
import { Form } from './form.entity';
import { FormService } from './form.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form]), FieldModule],
  providers: [FormService],
  controllers: [FormController],
  exports: [FormService],
})
export class FormModule {}
