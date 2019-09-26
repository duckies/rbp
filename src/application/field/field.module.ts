import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldController } from './field.controller';
import { Field } from './field.entity';
import { FieldService } from './field.service';

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  providers: [FieldService],
  controllers: [FieldController],
  exports: [FieldService],
})
export class FieldModule {}
