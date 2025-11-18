export interface CachedRate {
  rate: number;
  timestamp: number;
}

export interface CacheModuleOptions {
  redisUrl: string;
  cacheTTLSeconds: number;
  prefix: string;
}
