import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { transformException } from '@nestjs/platform-express/multer/multer/multer.utils';
import Multer from 'multer';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { QuestionService } from '../../question/question.service';
import { ConfigService } from '../../config/config.service';
import { Question, FieldType, FileTypes } from '../../question/question.entity';

export interface MulterField {
  name: string;
  maxCount?: number;
}

export interface MulterResponse {
  [fieldname: string]: Express.Multer.File[];
}

export type FileNameCallback = (error: Error | null, filename: string) => void;
export type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

/**
 * Uploads files as determined by the schema provided in a form.
 * Makes checks for the valid field names and mimetypes.
 */
export function FormFilesInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    protected multer: Multer.Instance;

    protected storage: Multer.StorageEngine;

    private fields: Multer.Field[];

    private questions: Question[];

    constructor(private readonly configService: ConfigService, private readonly questionService: QuestionService) {
      this.storage = Multer.diskStorage({
        destination: this.configService.get('FILE_LOCATION'),
        filename: this.fileName,
      });
      this.multer = Multer({
        storage: this.storage,
        fileFilter: this.fileFilter.bind(this),
      });
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest();
      const res = ctx.getResponse();

      this.questions = await this.questionService.findByFormAndType(req.params.id, FieldType.UPLOAD);

      this.fields = this.questions.map((q: Question) => ({
        name: q.id,
        maxCount: q.multiple ? q.multiple : 1,
      }));

      await new Promise((resolve, reject) =>
        this.multer.fields(this.fields)(req, res, (err: Error) => {
          if (err) {
            const error = transformException(err);
            return reject(error);
          }
          resolve();
        }),
      );
      return next.handle();
    }

    private fileName(_req: Request, file: Express.Multer.File, cb: FileNameCallback): void {
      cb(null, `${Date.now()}-${file.originalname}`);
    }

    private fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
      const question = this.questions.find((q: Question) => q.id === file.fieldname);

      // TODO: Match file type to mimetype.
      const fileType = FileTypes.Image;

      if (!question.fileTypes.includes(fileType)) {
        cb(new BadRequestException(`Question [${file.fieldname}] does now allow filetype ${fileType}`), false);
      }

      cb(null, true);
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
