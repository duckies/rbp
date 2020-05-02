import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AccessControlGuard, JWTGuard } from '../auth/guards';
import { OptionalAuthGuard } from '../auth/guards/optional.guard';
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
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('submission')
export class SubmissionController {
  constructor(
    private readonly fileService: FileService,
    private readonly submissionService: SubmissionService,
    @InjectRolesBuilder() private readonly rolebuilder: RolesBuilder,
  ) {}

  @Post()
  @UseGuards(JWTGuard)
  @UsePipes(CreateSubmissionPipe)
  create(@Usr() user: User, @Body() createSubmissionDto: CreateFormSubmissionDto) {
    return this.submissionService.create(user, createSubmissionDto);
  }

  @Post('upload')
  @UseGuards(JWTGuard)
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

  @Delete('file/:id')
  @UseGuards(JWTGuard)
  deleteFile(@Usr() user: User, @Param('id') id: number) {
    if (this.rolebuilder.can(user.roles).deleteAny('file-upload').granted) {
      return this.fileService.delete(id);
    } else {
      return this.fileService.delete(id, user);
    }
  }

  @Get('/user')
  @UseGuards(JWTGuard)
  findByUser(@Usr() user: User) {
    return this.submissionService.findByUser(user);
  }

  @Get('/user/open')
  @UseGuards(JWTGuard)
  findOpenByUser(@Usr() user: User): Promise<Pick<FormSubmission, 'id' | 'status'>> {
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

  @UseGuards(OptionalAuthGuard)
  @Get()
  findAll(@Query() { take, skip, status }: FindAllFormSubmissionsDto) {
    return this.submissionService.findAll(take, skip, status);
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

  @Auth({ action: 'delete', possession: 'any', resource: 'form-submission' })
  @Delete(':id')
  delete(@Param() { id }: FindFormSubmissionDto) {
    return this.submissionService.delete(id);
  }
}
