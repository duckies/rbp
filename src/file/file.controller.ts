import { Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { JWTGuard } from '../auth/guards';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { FindFileDto } from './dto';
import { File } from './file.entity';
import { FileService } from './file.service';
import { FormFilesInterceptor, MulterResponse } from './interceptors/form-files.interceptor';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // @Post(':id')
  // @UseGuards(JWTGuard)
  // @UseInterceptors(FormFilesInterceptor())
  // create(@Usr() user: User, @UploadedFiles() files: MulterResponse): Promise<ObjectLiteral[]> {
  //   return this.fileService.create(user, files);
  // }

  @Get(':id')
  findOne({ id }: FindFileDto): Promise<File> {
    return this.fileService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JWTGuard)
  delete(@Param() { id }: FindFileDto): Promise<File> {
    return this.fileService.delete(id);
  }
}
