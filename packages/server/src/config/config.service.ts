import { Inject, Injectable } from '@nestjs/common';
import { CONFIGURATION_TOKEN } from './config.constants';
import { ConfigSchema } from './config.schema';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(CONFIGURATION_TOKEN)
    private readonly internalConfig: ConfigSchema,
  ) {}

  get NODE_ENV() {
    return this.internalConfig.NODE_ENV;
  }

  get isDev() {
    return this.internalConfig.NODE_ENV === 'development';
  }

  get PORT() {
    return this.internalConfig.PORT;
  }

  get SECRET() {
    return this.internalConfig.JWT_SECRET;
  }

  get CLIENT_URL() {
    return this.internalConfig.CLIENT_URL;
  }

  get DISCORD() {
    return {
      CLIENT_ID: this.internalConfig.DISCORD_CLIENT_ID,
      SECRET_KEY: this.internalConfig.DISCORD_SECRET_KEY,
      CALLBACK: this.internalConfig.DISCORD_CALLBACK,
      WEBHOOK: this.internalConfig.DISCORD_WEBHOOK,
      BOT: {
        TOKEN: this.internalConfig.DISCORD_BOT_TOKEN,
        PREFIX: this.internalConfig.DISCORD_BOT_PREFIX,
      },
    };
  }

  get BLIZZARD() {
    return {
      CLIENT_ID: this.internalConfig.BLIZZARD_CLIENT_ID,
      SECRET_KEY: this.internalConfig.BLIZZARD_SECRET_KEY,
      CALLBACK: this.internalConfig.BLIZZARD_CALLBACK,
    };
  }

  get WARCRAFTLOGS() {
    return {
      CLIENT_ID: this.internalConfig.WCL_CLIENT_ID,
      SECRET_KEY: this.internalConfig.WCL_SECRET_KEY,
    };
  }

  get TWITCH() {
    return {
      CLIENT_ID: this.internalConfig.TWITCH_CLIENT_ID,
      SECRET_KEY: this.internalConfig.TWITCH_SECRET_KEY,
    };
  }
}
