import { Injectable } from '@nestjs/common';
import rc = require('rc');

@Injectable()
export class ConfigService {
  private readonly config: { [key: string]: string };

  constructor() {
    this.config = rc('config');
  }

  get(key: string): string {
    return this.config[key];
  }
}
