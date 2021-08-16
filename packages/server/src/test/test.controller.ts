import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service.js';

@Controller('/test')
export class TestController {
  constructor(private test: TestService) {}

  @Get()
  async get() {
    return this.test.getTest();
  }
}
