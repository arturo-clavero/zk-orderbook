import { Module, Global } from '@nestjs/common';
import { RedisModule as BalRedisModule } from '@nestjs-modules/ioredis';
@Global()
@Module({
  imports: [
    BalRedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    }),
  ],
  exports: [BalRedisModule],
})
export class RedisModule {}
