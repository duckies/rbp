import { Controller, Param, Post, UseGuards, Delete } from '@nestjs/common';
import { AccessControlGuard } from '../auth/guards';
import { FindFormSubmissionDto } from '../form-submission/dto';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { FormSubmissionReadService } from './form-submission-read.service';

@UseGuards(AccessControlGuard)
@Controller('/submission-read')
export class FormSubmissionReadController {
  constructor(private readonly formSubmissionReadService: FormSubmissionReadService) {}

  @Post(':id')
  create(@Usr() user: User, @Param() { id }: FindFormSubmissionDto) {
    return this.formSubmissionReadService.create(id, user.id);
  }

  @Delete(':id')
  delete(@Usr() user: User, @Param() { id }: FindFormSubmissionDto) {
    return this.formSubmissionReadService.delete(id, user.id);
  }
}
