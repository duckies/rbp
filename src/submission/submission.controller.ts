import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateSubmissionDto } from './dto';
import { CreateSubmissionPipe } from './pipes/create-submission.pipe';
import { Submission } from './submission.entity';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @UsePipes(CreateSubmissionPipe)
  create(@Body() createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    return this.submissionService.create(createSubmissionDto);
  }
}
