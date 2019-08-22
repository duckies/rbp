import { BullModule } from 'nest-bull';
import { DynamicModule, Module, Global } from '@nestjs/common';

/**
 * This is necessary because of a change in NestJS 6.3.1
 * that no longer leaks this kind of module.
 * 
 * Follow: https://github.com/nestjsx/nest-bull/issues/110
 */

const QueueModule: DynamicModule = BullModule.forRoot([
  { name: 'character' },
  { name: 'raiderIO' },
]);

@Global()
@Module({
  imports: [QueueModule],
  exports: [QueueModule],
})
export class SharedBullModule {}
