/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { prisma } from '../lib/prisma-trading-database/prisma-trading';

const PYUSD_ADDRESS = process.env.PYUSD_ADDRESS?.toLowerCase() ?? '';
const USDT_ADDRESS = process.env.USDT_ADDRESS?.toLowerCase() ?? '';
console.log('address id ', PYUSD_ADDRESS);
console.log('address id ', USDT_ADDRESS);
export const TOKEN_MAP: Record<string, string> = {
  [PYUSD_ADDRESS]: 'PYUSD',
  [USDT_ADDRESS]: 'USDT',
};

@Controller('deposit')
export class DepositController {
  @Post()
  async handleDeposit(@Body() dataEnvio: any) {
    let { traderId, token, amount, txHash } = dataEnvio;
    traderId = traderId.toLowerCase();
    token = token.toLowerCase();

    console.log('data which backend recevies is in the deposit', dataEnvio);
    if (!traderId || !token || !amount || !txHash) {
      return {
        success: false,
        message: 'Missing data',
      };
    }
    //find trader
    const trader = await prisma.trader.upsert({
      where: { address: traderId },
      create: { address: traderId },
      update: {},
    });
    console.log('Trader which was not found is ', trader);
    const currency = TOKEN_MAP[token] || token;
    // check if acount exists
    const account = await prisma.account.findFirst({
      where: {
        traderId: trader.id,
        currency: currency,
      },
    });
    if (!account) {
      console.log('Account which was not found is ', account);
      console.error('Account was not found, action will be ignnored');
      return;
    }
    try {
      const existing = await prisma.transaction.findUnique({
        where: { txHash },
      });
      if (existing) {
        console.log(`Hash ${txHash} for this transaction exists, skipping`);
        return {
          success: false,
          message: 'Transaction is already created',
        };
      }
      //kyc if it will be time
      console.log('received from frontend', dataEnvio);
      // to db
      const deposit = await prisma.transaction.upsert({
        where: { txHash },
        create: {
          type: 'deposit',
          traderId: trader.id,
          token,
          amount: Number(amount),
          status: txHash ? 'Confirmed' : 'Pending',
          txHash: txHash || null,
        },
        update: {},
      });
      if (deposit.status === 'Confirmed') {
        await prisma.account.update({
          where: { id: account.id },
          data: { available: { increment: Number(amount) } },
        });
        console.log('Saved to dataabase wtih id', deposit.id);
      }
      //what backend decided
      return {
        success: true,
        message: 'Deposit saved successfully',
        depositId: deposit.id,
        txHash: txHash,
        status: deposit.status,
      };
    } catch (error) {
      console.error('Error occured', error);
      return {
        success: false,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }
}
