import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submission } from './submission.entity';

@Injectable()
export class SubmissionService {
  constructor(@InjectRepository(Submission) private readonly repository: Repository<Submission>) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    // return this.repository.save(createSubmissionDto);
    console.log(createSubmissionDto);
    return null;
  }
}
