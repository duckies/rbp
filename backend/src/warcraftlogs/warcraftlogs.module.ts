import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '../http/http.module';
import {
  WCL_CLIENT_ID,
  WCL_CLIENT_SECRET,
  WCL_TOKEN_URL,
} from './warcraftlogs.constants';
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
          clientId: config.get(WCL_CLIENT_ID),
          clientSecret: config.get(WCL_CLIENT_SECRET),
          tokenUrl: config.get(WCL_TOKEN_URL),
        },
      }),
    }),
  ],
  providers: [WarcraftLogsService],
  exports: [WarcraftLogsService],
})
export class WarcraftLogsModule {}
