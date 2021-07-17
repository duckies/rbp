import Joi from 'joi';

export interface ConfigSchema extends Record<string, any> {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  JWT_SECRET: string;
  MINIMUM_CHARACTER_LEVEL: number;
  CLIENT_URL: string;

  BLIZZARD_CLIENT_ID: string;
  BLIZZARD_SECRET_KEY: string;
  BLIZZARD_CALLBACK: string;

  DISCORD_CLIENT_ID: string;
  DISCORD_SECRET_KEY: string;
  DISCORD_CALLBACK: string;
  DISCORD_WEBHOOK: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_BOT_PREFIX: string;

  WCL_CLIENT_ID: string;
  WCL_SECRET_KEY: string;

  TWITCH_CLIENT_ID: string;
  TWITCH_SECRET_KEY: string;
}

export const configSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().default('testing'),
  CLIENT_URL: Joi.string().default('http://localhost:9000'),
  BLIZZARD_CLIENTID: Joi.string().required(),
  BLIZZARD_SECRET: Joi.string().required(),
  BLIZZARD_CALLBACK: Joi.string().required(),
  MINIMUM_CHARACTER_LEVEL: Joi.number().default(10),
  CODECOV_TOKEN: Joi.string(),
  DISCORD_CLIENT_ID: Joi.string().required(),
  DISCORD_SECRET: Joi.string().required(),
  DISCORD_WEBHOOK: Joi.string().required(),
  DISCORD_CALLBACK: Joi.string().default('http://localhost:3030/callback'),
  DISCORD_BOT_TOKEN: Joi.string().required(),
  DISCORD_BOT_PREFIX: Joi.string().default('/'),
  TWITCH_CLIENT_ID: Joi.string().required(),
  TWITCH_SECRET_KEY: Joi.string().required(),
  BASE_URL: Joi.string().default('http://localhost:3030/'),
  WCL_CLIENT_ID: Joi.string().required(),
  WCL_CLIENT_SECRET: Joi.string().required(),
  WCL_TOKEN_URL: Joi.string().required(),
});
