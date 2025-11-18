export interface CacheModuleOptions {
  redisUrl: string;
  cacheTTLSeconds: number;
  prefix: string;
}
