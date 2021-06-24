import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { HttpAuthStrategy } from './http-auth-strategy.enum';

export interface OAuthEnvironmentOptions {
  name: string;
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  retries?: number;
}

export interface HttpAuthBase {
  retries?: number;
}

export interface HttpModuleOptions {
  axios?: AxiosRequestConfig;
  [HttpAuthStrategy.OAUTH]?: OAuthEnvironmentOptions;
}

export interface HttpModuleOptionsFactory {
  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions;
}

export interface HttpModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<HttpModuleOptionsFactory>;
  useClass?: Type<HttpModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<HttpModuleOptions> | HttpModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
