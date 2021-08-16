import { Module } from '@nestjs/common';
import { TestController } from './test.controller.js';
import { TestService } from './test.service.js';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestService],
  exports: [],
})
export class TestModule {}
