import Joi from '@hapi/joi';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MikroORM } from 'mikro-orm';
import { AccessControlModule } from 'nest-access-control';
import { MikroOrmModule } from 'nestjs-mikro-orm';
import request from 'supertest';
import MikroOMRConfig from '../mikro-orm.config';
import { roleBuilder, Roles } from '../src/app.roles';
import { ArticleModule } from '../src/article/article.module';
import { CreateArticleDTO } from '../src/article/dto/create-article.dto';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/user/user.entity';

MikroOMRConfig.dbName = 'rbp_test';

describe('Articles', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let authService: AuthService;

  /**
   * Seed Data
   */

  let user: User;
  let jwt: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(MikroOMRConfig),
        ArticleModule,
        AuthModule,
        AccessControlModule.forRoles(roleBuilder),
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: Joi.object({
            NODE_ENV: Joi.string().valid('development', 'production', 'test').default('test'),
            PORT: Joi.number().default(5050),
            JWT_SECRET: Joi.string().default('testing'),
            BLIZZARD_CLIENTID: Joi.string().required(),
            BLIZZARD_SECRET: Joi.string().required(),
            BLIZZARD_CALLBACK: Joi.string().required(),
            MINIMUM_CHARACTER_LEVEL: Joi.number().default(110),
            CODECOV_TOKEN: Joi.string(),
            DISCORD_CLIENT_ID: Joi.string().required(),
            DISCORD_SECRET: Joi.string().required(),
            DISCORD_WEBHOOK: Joi.string().required(),
            DISCORD_CALLBACK: Joi.string().default('http://localhost:3030/callback'),
            BASE_URL: Joi.string().default('http://localhost:3030/'),
          }),
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    orm = moduleRef.get(MikroORM);
    authService = moduleRef.get(AuthService);

    const generator = orm.getSchemaGenerator();
    await generator.ensureDatabase();
    await generator.dropSchema();
    await generator.createSchema();

    /**
     * Seeding Data
     */

    user = orm.em.create(User, {
      discord_id: '123456789',
      discord_username: 'JaneDoe',
      discord_discriminator: '1337',
      roles: [Roles.GuildMaster],
    });

    await orm.em.persistAndFlush(user);

    jwt = authService.signToken(user);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useLogger(new Logger());

    await app.init();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe(`POST /article`, () => {
    test('throws 401 for unauthenticated', async () => {
      await request(app.getHttpServer()).post('/article').expect(401);
    });

    test('creating an article', async () => {
      const data: CreateArticleDTO = {
        title: 'Example Article',
        subtitle: 'Example Subtitle',
        content: 'Example Content',
        header: 'nul',
      };

      await request(app.getHttpServer())
        .post('/article')
        .send(data)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(201);
    });
  });

  describe('GET /article', () => {
    test('the presence of created articles', async () => {
      const resp = await request(app.getHttpServer()).get('/article').expect(200);

      console.log(resp);
    });
  });
});
