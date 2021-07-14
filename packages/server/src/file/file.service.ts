import { FilterQuery, Populate, EntityManager } from '@mikro-orm/core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { User } from '../user/user.entity';
import { FileUpload } from './file.entity';
import { File } from './interfaces/file.interface';

@Injectable()
export class FileService {
  constructor(private readonly em: EntityManager) {}

  async create(files: File[], user?: User) {
    const fileEntities = files.map((file) => {
      const fileEntity = this.em.create(FileUpload, {
        filename: file.filename,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
      });

      if (user) {
        fileEntity.author = user;
      }

      return fileEntity;
    });

    await this.em.persist(fileEntities).flush();

    return fileEntities;
  }

  findAll(
    where: FilterQuery<FileUpload>,
    populate: Populate<FileUpload> = ['author'],
  ) {
    return this.em.findAndCount(FileUpload, where, populate);
  }

  async delete(where: FilterQuery<FileUpload>, user?: User) {
    const file = await this.em.findOneOrFail(FileUpload, where, ['author']);

    if (user && file.author.id !== user.id) {
      throw new UnauthorizedException('You do not own this file');
    }

    await unlink(file.path);

    await this.em.remove(file).flush();
  }
}
