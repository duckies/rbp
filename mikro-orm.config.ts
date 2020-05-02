import { NotFoundException } from '@nestjs/common';
import { Options } from 'mikro-orm';
import { Article } from './src/article/article.entity';
import { WoWAsset } from './src/blizzard/assets.entity';
import { FileUpload } from './src/file/file.entity';
import { FormCharacter } from './src/form-character/form-character.entity';
import { FormComment } from './src/form-comment/form-comment.entity';
import { FormQuestion } from './src/form-question/question.entity';
import { FormSubmission } from './src/form-submission/form-submission.entity';
import { Form } from './src/form/form.entity';
import { GuildCharacter } from './src/guild-character/character.entity';
import { Raid } from './src/raid/raid.entity';
import { Slide } from './src/slide/slide.entity';
import { User } from './src/user/user.entity';

require('dotenv').config({ path: '../.env' });

const config: Options = {
  entities: [
    Article,
    WoWAsset,
    GuildCharacter,
    FileUpload,
    Form,
    FormCharacter,
    FormComment,
    FormQuestion,
    FormSubmission,
    Raid,
    Slide,
    User,
  ],
  type: 'postgresql',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  dbName: process.env.DATABASE_DATABASE || 'backend',
  cache: { options: { cacheDir: './dist/temp' } },
  debug: true,
  findOneOrFailHandler: (entityName: string) => {
    return new NotFoundException(`${entityName} was not found.`);
  },
};

export default config;
