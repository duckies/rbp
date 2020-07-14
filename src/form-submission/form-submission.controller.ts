import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AccessControl } from 'accesscontrol';
import multer from 'multer';
import { Auth } from '../auth/decorators/auth.decorator';
import { InjectAccessControl } from '../auth/decorators/inject-access-control.decorator';
import { FileService } from '../file/file.service';
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

@Controller('submission')
export class SubmissionController {
  constructor(
    private readonly fileService: FileService,
    private readonly submissionService: SubmissionService,
    @InjectAccessControl() private readonly ac: AccessControl,
  ) {}

  @Auth()
  @Post()
  @UsePipes(CreateSubmissionPipe)
  create(
    @Usr() user: User,
    @Body() createSubmissionDto: CreateFormSubmissionDto,
  ) {
    return this.submissionService.create(user, createSubmissionDto);
  }

  @Auth()
  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/applications/');
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  uploadFiles(@Usr() user: User, @UploadedFiles() files) {
    return this.fileService.create(files, user);
  }

  @Auth()
  @Delete('file/:id')
  deleteFile(@Usr() user: User, @Param('id') id: number) {
    if (this.ac.can(user.roles).deleteAny('file-upload').granted) {
      return this.fileService.delete(id);
    } else {
      return this.fileService.delete(id, user);
    }
  }

  @Auth()
  @Get('/user')
  findByUser(@Usr() user: User) {
    return this.submissionService.findByUser(user);
  }

  @Auth()
  @Get('/user/open')
  findOpenByUser(
    @Usr() user: User,
  ): Promise<Pick<FormSubmission, 'id' | 'status'>> {
    return this.submissionService.findOpenByUser(user);
  }

  @Get('/status/:status')
  findFirstByStatus(@Param() { status }: FindFormSubmissionByStatusDto) {
    return this.submissionService.findFirstByStatus(status);
  }

  @Get(':id')
  findOne(@Param() { id }: FindFormSubmissionDto) {
    return this.submissionService.findOne(id);
  }

  @Get()
  findAll(@Query() { take, skip, status }: FindAllFormSubmissionsDto) {
    return this.submissionService.findAll(take, skip, status);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param() { id }: FindFormSubmissionDto,
    @Usr() user: User,
    @Body() updateFormSubmissionDto: UpdateFormSubmissionDto,
  ) {
    const canUpdateAny = this.ac.can(user.roles).updateAny('form-submission')
      .granted;

    return this.submissionService.update(
      id,
      user,
      updateFormSubmissionDto,
      canUpdateAny,
    );
  }

  @Auth('form-submission', 'delete:any')
  @Delete(':id')
  delete(@Param() { id }: FindFormSubmissionDto) {
    return this.submissionService.delete(id);
  }
}
