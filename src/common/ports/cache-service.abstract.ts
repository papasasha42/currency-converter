export abstract class CacheService {
    abstract get<T>(key: string): Promise<T | null>;
    abstract set(key: string, value: any, ttl: number): Promise<void>;
  }
  