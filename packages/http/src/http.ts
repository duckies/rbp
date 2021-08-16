import got, {
  BeforeErrorHook,
  BeforeRequestHook,
  ExtendOptions,
  Got,
  OptionsOfJSONResponseBody,
} from 'got';
import { HTTPOAuthEnvironment } from './modules/oauth/oauth-environment';
import { HTTPOAuthModule } from './modules/oauth/oauth-module';

export type AuthOptions = OAuth2Options | APIKeyOptions;

export interface OAuth2Options {
  type: 'oauth2';
  name: string;
  tokenUrl: string;
  client_id: string;
  client_secret: string;
}

export interface APIKeyOptions {
  type: 'apiKey';
  name: string;
  key: string;
}

export class HTTP {
  private readonly modules: Array<any> = [];
  private readonly _got;

  constructor(options?: ExtendOptions, auth?: AuthOptions) {
    this._got = got.extend(options || {});
    this.setupAuth(auth);
  }

  private setupAuth(auth?: AuthOptions) {
    if (!auth) return;

    switch (auth.type) {
      case 'oauth2':
        const environment = new HTTPOAuthEnvironment(
          auth.name,
          auth.client_id,
          auth.client_secret,
          auth.tokenUrl,
        );

        this.modules.push(new HTTPOAuthModule(this, environment));

        break;
    }
  }

  public setHeader(name: string, value: string | false): void {
    if (!value) {
      delete this._got.defaults.options.headers[name];
    } else {
      this._got.defaults.options.headers[name] = value;
    }
  }

  public extend(instancesOrOptions: Got | ExtendOptions) {
    return this._got.extend(instancesOrOptions);
  }

  public $post<T = any>(
    url: string,
    json?: Record<string, any>,
    options?: OptionsOfJSONResponseBody,
  ) {
    return got.post(url, { json, ...options }).json<T>();
  }

  public $get<T = any>(url: string, options?: OptionsOfJSONResponseBody) {
    return got.get<T>(url, options).json();
  }

  public onBeforeRequest(fn: BeforeRequestHook) {
    this._got.defaults.options.hooks.beforeRequest.push(fn);
  }

  public onBeforeError(fn: BeforeErrorHook) {
    this._got.defaults.options.hooks.beforeError.push(fn);
  }
}
