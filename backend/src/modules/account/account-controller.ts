/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { prisma } from '../../lib/prisma-trading-database/prisma-trading';
import { RedisBalanceService } from '../redis/redis.service';

@Controller('account')
export class AccountController {
  constructor(private readonly redisBalanceService: RedisBalanceService) {}

  @Post('check')
  async checkAccount(@Body() body: { address: string; token: string }) {
    const { address, token } = body;
    console.log('data which backend recevies for checking account is', body);
    let trader = await prisma.trader.findUnique({
      where: {
        address: address,
      },
    });
    console.log('trader which was found in account', trader);
    if (!trader) {
      trader = await prisma.trader.create({
        data: { address },
      });
      console.log('account was created', trader.id);
      return {
        success: false,
        message:
          'account was created for you need to verify kyc,deposit will not be successfull',
      };
    }
    console.log('trader id', trader.id);
    let account = await prisma.account.findFirst({
      where: {
        traderId: trader.id,
        currency: token,
      },
    });
    if (!account) {
      account = await prisma.account.create({
        data: { currency: token, traderId: trader.id, available: 0 },
      });
      console.log('Accout was created for address ${address} in ${token}');
    }
    //redis check
    const redisBalance = await this.redisBalanceService.getBalance(
      address,
      token,
    );
    return {
      exists: true,
      accountId: account.id,
      balance: redisBalance,
      message: 'Account exists',
    };
  }
}
