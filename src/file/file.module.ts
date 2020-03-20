import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUpload } from './file.entity';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileUpload])],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
