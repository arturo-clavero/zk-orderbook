/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
@Injectable()
export class RedisBalanceService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getBalance(address: string, token: string): Promise<number> {
    const value = await this.redis.hget(`balance:${address}`, token);
    return parseFloat(value || '0');
  }
  async setBalance(address: string, token: string, amount: number) {
    await this.redis.hset(`balance:${address}`, token, amount.toString());
  }
  async increaseBalance(address: string, token: string, amount: number) {
    const current = await this.getBalance(address, token);
    await this.setBalance(address, token, current + amount);
  }
  async getAllBalances(address: string) {
    return this.redis.hgetall(`balance:${address}`);
  }
}
