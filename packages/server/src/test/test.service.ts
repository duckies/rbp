import { Inject, Injectable } from '@nestjs/common';
import { HTTP } from '@rbp/http';

@Injectable()
export class TestService {
  private readonly http: HTTP;

  constructor() {
    this.http = new HTTP();
  }

  async getTest() {
    return this.http.$get('https://axoltlapi.herokuapp.com/');
  }
}
