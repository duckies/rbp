import { DynamicModule, Module, Provider } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import {
  AXIOS_INSTANCE_TOKEN,
  AXIOS_RETRY_LIMIT,
  HTTP_ENVIRONMENT_TOKEN,
  HTTP_MODULE_OPTIONS,
  HTTP_STRATEGY_TOKEN,
} from './http.constants';
import { HttpService } from './http.service';
import {
  HttpModuleAsyncOptions,
  HttpModuleOptions,
  HttpModuleOptionsFactory,
} from './interfaces/http-module.interface';
import { OAuthEnvironment } from './oauth/oauth.environment';
import { OAuthStrategy } from './oauth/oauth.strategy';

@Module({
  providers: [
    HttpService,
    {
      provide: AXIOS_INSTANCE_TOKEN,
      useValue: Axios,
    },
  ],
  exports: [HttpService],
})
export class HttpModule {
  static register(options: HttpModuleOptions): DynamicModule {
    return {
      module: HttpModule,
      providers: [...this.createBaseProviders(options)],
    };
  }

  static registerAsync(options: HttpModuleAsyncOptions): DynamicModule {
    const providers = [...this.createAsyncProviders(options)];
    let axios: AxiosInstance;
    let environment: OAuthEnvironment;

    return {
      module: HttpModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useFactory: (options: HttpModuleOptions) =>
            (axios = Axios.create(options.axios)),
          inject: [HTTP_MODULE_OPTIONS],
        },
        {
          provide: HTTP_ENVIRONMENT_TOKEN,
          useFactory: (options: HttpModuleOptions) => {
            if (options.oauth) {
              return (environment = new OAuthEnvironment(
                options.oauth.name,
                options.oauth.clientId,
                options.oauth.clientSecret,
                options.oauth.tokenUrl,
              ));
            }

            return null;
          },
          inject: [HTTP_MODULE_OPTIONS],
        },
        {
          provide: HTTP_STRATEGY_TOKEN,
          useFactory: (options: HttpModuleOptions) => {
            if (options.oauth) {
              return new OAuthStrategy(
                axios,
                options.oauth.retries || 5,
                environment,
              );
            }

            return null;
          },
          inject: [HTTP_MODULE_OPTIONS],
        },
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createBaseProviders(options: HttpModuleOptions) {
    const axios = Axios.create(options.axios);

    const providers: Provider[] = [
      {
        provide: AXIOS_INSTANCE_TOKEN,
        useValue: axios,
      },
    ];

    if (options.oauth) {
      const environment = new OAuthEnvironment(
        options.oauth.name,
        options.oauth.clientId,
        options.oauth.clientSecret,
        options.oauth.tokenUrl,
      );

      const strategy = new OAuthStrategy(
        axios,
        options.oauth.retries || 5,
        environment,
      );

      providers.push(
        {
          provide: HTTP_ENVIRONMENT_TOKEN,
          useValue: environment,
        },
        {
          provide: HTTP_STRATEGY_TOKEN,
          useValue: strategy,
        },
        {
          provide: AXIOS_RETRY_LIMIT,
          useValue: options.oauth.retries || 5,
        },
      );
    }

    return providers;
  }

  private static createAsyncProviders(
    options: HttpModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: HttpModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: HTTP_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: HTTP_MODULE_OPTIONS,
      useFactory: async (optionsFactory: HttpModuleOptionsFactory) =>
        optionsFactory.createHttpOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
