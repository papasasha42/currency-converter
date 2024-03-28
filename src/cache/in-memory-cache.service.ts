import { Injectable } from '@nestjs/common';
import { CacheService } from '../common/ports/cache-service.abstract';

@Injectable()
export class InMemoryCacheService implements CacheService {
  private cache = new Map<string, { value: any; expiration: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (item && Date.now() < item.expiration) {
      return item.value;
    }
    return null;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    const expiration = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiration });
  }
}
