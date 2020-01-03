import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AccessControlGuard, JWTGuard } from '../auth/guards';
import { OptionalAuthGuard } from '../auth/guards/optional.guard';
import { Usr } from '../user/user.decorator';
import { User } from '../user/user.entity';
import {
  CreateFormSubmissionDto,
  FindAllFormSubmissionsDto,
  FindFormSubmissionByStatusDto,
  FindFormSubmissionDto,
  UpdateFormSubmissionDto,
} from './dto';
import { FormSubmission } from './form-submission.entity';
import { SubmissionService } from './form-submission.service';
import { CreateSubmissionPipe } from './pipes/create-submission.pipe';
import { PutSeenFormSubmissionDto } from './dto/put-seen-form-submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    @InjectRolesBuilder() private readonly rolebuilder: RolesBuilder,
  ) {}

  @Post()
  @UseGuards(JWTGuard)
  @UsePipes(CreateSubmissionPipe)
  create(@Usr() user: User, @Body() createSubmissionDto: CreateFormSubmissionDto): Promise<FormSubmission> {
    return this.submissionService.create(user, createSubmissionDto);
  }

  @Get('/user')
  @UseGuards(JWTGuard)
  findByUser(@Usr() user: User): Promise<FormSubmission[]> {
    return this.submissionService.findByUser(user);
  }

  @Get('/user/open')
  @UseGuards(JWTGuard)
  findOpenByUser(@Usr() user: User): Promise<Pick<FormSubmission, 'id' | 'status'>> {
    return this.submissionService.findOpenByUser(user);
  }

  @Get('/status/:status')
  findFirstByStatus(@Param() { status }: FindFormSubmissionByStatusDto): Promise<FormSubmission> {
    return this.submissionService.findFirstByStatus(status);
  }

  @Get(':id')
  findOne(@Param() { id }: FindFormSubmissionDto): Promise<FormSubmission> {
    return this.submissionService.findOne(id);
  }

  @UseGuards(OptionalAuthGuard)
  @Get()
  findAll(
    @Query() { take, skip, status, id }: FindAllFormSubmissionsDto,
    @Usr() user?: User,
  ): Promise<[FormSubmission[], number]> {
    console.log(`Received user in request?: ${!!user} - ${user ? user.id : '[?]'}`);
    return this.submissionService.findAll(take, skip, status, id, user);
  }

  @UseGuards(AccessControlGuard)
  @Patch(':id')
  update(
    @Param() { id }: FindFormSubmissionDto,
    @Usr() user: User,
    @Body() updateFormSubmissionDto: UpdateFormSubmissionDto,
  ) {
    if (this.rolebuilder.can(user.roles).updateAny('form-submission').granted) {
      return this.submissionService.update(id, updateFormSubmissionDto);
    } else {
      return this.submissionService.updateOwn(id, user, updateFormSubmissionDto);
    }
  }
}
