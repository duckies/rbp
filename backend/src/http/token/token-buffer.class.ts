import { AxiosRequestConfig } from 'axios';
import { EventEmitter } from 'events';
import { AxiosRetryConfig } from '../http.service';

export class CredentialBuffer {
  private locked = false;
  private requests: AxiosRequestConfig[] = [];
  private readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);
  }

  get isLocked() {
    return this.locked === true;
  }

  public lock() {
    this.locked = true;
  }

  public unlock() {
    this.locked = false;
  }

  enqueue(config: AxiosRetryConfig) {
    this.requests.push(config);

    return new Promise((resolve, reject) => {
      const completeHandler = (req: AxiosRequestConfig) => {
        if (config === req) {
          this.emitter.removeListener('complete', completeHandler);
          resolve(config);
        }
      };

      const failHandler = (error: Error) => {
        this.emitter.removeListener('fail', failHandler);
        reject(error);
      };

      this.emitter.on('complete', completeHandler);
      this.emitter.on('fail', failHandler);
    });
  }

  flush(error?: Error) {
    if (error) {
      this.emitter.emit('fail', error);
    } else {
      for (const request of this.requests) {
        this.emitter.emit('complete', request);
      }
    }

    this.requests = [];
    this.emitter.removeAllListeners();
  }
}
