import { Module } from '@nestjs/common';
import { HttpModule } from '../common/http/http.module';
import { ConfigService } from '../config/config.service';
import { WarcraftLogsService } from './warcraftlogs.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        axios: {
          baseURL: 'https://www.warcraftlogs.com/api/v2/client',
        },
        oauth: {
          name: 'WarcraftLogs',
          clientId: config.WARCRAFTLOGS.CLIENT_ID,
          clientSecret: config.WARCRAFTLOGS.SECRET_KEY,
          tokenUrl: 'https://www.warcraftlogs.com/oauth/token',
        },
      }),
    }),
  ],
  providers: [WarcraftLogsService],
  exports: [WarcraftLogsService],
})
export class WarcraftLogsModule {}
