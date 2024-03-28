import { Module, DynamicModule } from '@nestjs/common';
import { ExchangeRateProvider } from '../common/ports/exchange-rate-provider.abstract';
import { MonobankService } from './monobank/monobank.service';
import { CacheModule } from '../cache/cache.module';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class ExchangeRateProviderModule {
  static register(): DynamicModule {
    return {
      module: ExchangeRateProviderModule,
      providers: [
        {
          provide: ExchangeRateProvider,
          useClass: MonobankService,
        },
      ],
      exports: [ExchangeRateProvider],
      imports: [CacheModule.register(), HttpModule],
    };
  }
}
