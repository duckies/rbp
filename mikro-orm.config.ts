import { BaseEntity, Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { NotFoundException } from '@nestjs/common';
import dotenv from 'dotenv';

dotenv.config();

const config: Options = {
  entities: [BaseEntity, 'dist/**/*.entity.js'],
  entitiesTs: [BaseEntity, 'src/**/*.entity.ts'],
  type: 'postgresql',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  dbName: process.env.DATABASE_NAME || 'backend',
  debug: process.env.NODE_ENV === 'development',
  highlighter: new SqlHighlighter(),
  strict: true,
  findOneOrFailHandler: () => {
    return new NotFoundException();
  },
};

export default config;
