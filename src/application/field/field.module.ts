import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), AuthModule],
  providers: [FieldService],
  controllers: [FieldController],
  exports: [FieldService],
})
export class FieldModule {}