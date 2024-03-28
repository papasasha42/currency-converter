import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { CacheService } from '../common/ports/cache-service.abstract';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisCacheService implements CacheService, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_CONNECTION_STRING');

    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined');
    }

    this.client = new Redis(redisUrl);
  }
  async onModuleDestroy() {
    await this.client.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }
}
