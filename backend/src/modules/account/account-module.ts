import { Module } from '@nestjs/common';
import { AccountController } from '../account/account-controller';
import { RedisBalanceService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [AccountController],
  providers: [RedisBalanceService],
  exports: [RedisBalanceService],
})
export class AccountModule {}
