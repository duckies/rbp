import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fsPromises } from 'fs';
import { ObjectLiteral, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { File } from './file.entity';
import { MulterResponse } from './interceptors/form-files.interceptor';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly repository: Repository<File>,
  ) {}

  /**
   * Inserts files into the database.
   * @param files Multer file(s)
   */
  async create(user: User, files: MulterResponse): Promise<ObjectLiteral[]> {
    const entities = Object.values(files)[0].map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      mimetype: f.mimetype,
      fieldname: f.fieldname,
      size: f.size,
      folder: f.destination,
      path: f.path,
      url: f.location,
      ownerId: user.id,
    }));

    // For some reason not including an InsertResult on normal saves.
    const resp = await this.repository
      .createQueryBuilder()
      .insert()
      .values(entities)
      .returning('*')
      .execute();

    return resp.generatedMaps;
  }

  /**
   * Retrieves a file.
   * @param id File UUID
   */
  findOne(id: string): Promise<File> {
    return this.repository.findOneOrFail(id);
  }

  /**
   * Removes a file from the local filesystem and associated entities.
   * @param id File UUID
   */
  async delete(id: string): Promise<File> {
    const file = await this.repository.findOneOrFail(id);

    try {
      await fsPromises.unlink(file.path);
    } catch (err) {
      if (err && err.code === 'ENOENT') {
        throw new NotFoundException('File was not found.');
      } else if (err) {
        throw new InternalServerErrorException('Error occured attempting to remove file.');
      }
    }

    return this.repository.remove(file);
  }
}
