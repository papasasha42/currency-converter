import { Module, DynamicModule } from '@nestjs/common';
import { CacheService } from '../common/ports/cache-service.abstract';
import { RedisCacheService } from './redis-cache.service';
import { InMemoryCacheService } from './in-memory-cache.service';

@Module({})
export class CacheModule {
  static register(): DynamicModule {
    const providers = [
      {
        provide: CacheService,
        useClass:
          process.env.CACHE_PROVIDER === 'redis'
            ? RedisCacheService
            : InMemoryCacheService,
      },
    ];

    return {
      module: CacheModule,
      providers: providers,
      exports: providers,
    };
  }
}
