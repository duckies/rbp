import { DynamicModule, Global, Module } from '@nestjs/common';
import { BullModule } from 'nest-bull';

/**
 * Still need forFeature to use this in each individual module?
 */
const QueueModule: DynamicModule = BullModule.register([{ name: 'character' }, { name: 'raiderIO' }, { name: 'user' }]);

@Global()
@Module({
  imports: [QueueModule],
  exports: [QueueModule],
})
export class BullSharedModule {}
