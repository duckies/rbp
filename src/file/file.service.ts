import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import { In, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { FileUpload } from './file.entity';
import { File } from './interfaces/file.interface';

const { unlink } = fs.promises;

@Injectable()
export class FileService {
  constructor(@InjectRepository(FileUpload) private readonly fileRepository: Repository<FileUpload>) {}

  create(files: File[], user?: User) {
    const fileEntities = files.map(file => {
      const fileEntity = new FileUpload();
      fileEntity.filename = file.filename;
      fileEntity.mimetype = file.mimetype;
      fileEntity.path = file.path;
      fileEntity.size = file.size;

      if (user) {
        fileEntity.author = user;
      }

      return fileEntity;
    });

    return this.fileRepository.save(fileEntities);
  }

  find(ids: number[]) {
    return this.fileRepository.find({ where: { id: In(ids) }, relations: ['author'] });
  }

  async delete(id: number) {
    const file = await this.fileRepository.findOneOrFail(id);

    await unlink(file.path);

    return this.fileRepository.remove(file);
  }
}
