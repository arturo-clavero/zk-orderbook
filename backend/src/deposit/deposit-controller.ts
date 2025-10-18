/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { prisma } from '../lib/prisma-trading-database/prisma-trading';

@Controller('deposit')
export class DepositController {
  @Post()
  async handleDeposit(@Body() dataEnvio: any) {
    const { traderId, token, amount, txHash } = dataEnvio;
    console.log('data which backend recevies is', dataEnvio);
    if (!traderId || !token || !amount || !txHash) {
      return {
        success: false,
        message: 'Missing data',
      };
    }
    //find/create trader
    const trader = await prisma.trader.upsert({
      where: { address: traderId },
      create: { address: traderId },
      update: {},
    });
    // Creat/check if acount exists
    let account = await prisma.account.findFirst({
      where: {
        traderId: trader.id,
        currency: token,
      },
    });
    if (!account) {
      account = await prisma.account.create({
        data: { currency: token, traderId: trader.id },
      });
      console.log('account was created', account.id);
      return {
        success: false,
        message:
          'account was created for you need to verify kyc,deposit will not be successfull',
      };
    }
    try {
      //kyc if it will be time
      console.log('received from frontend', dataEnvio);
      // to db
      const deposit = await prisma.transaction.create({
        data: {
          type: 'deposit',
          traderId: trader.id,
          token,
          amount: Number(amount),
          status: txHash ? 'Confirmed' : 'Pending',
          txHash: txHash || null,
        },
      });
      if (deposit.status === 'Confirmed') {
        await prisma.account.update({
          where: { id: account.id },
          data: { available: { increment: Number(amount) } },
        });
        console.log('Saved to dataabase wtih id', deposit.id);
      }
      // const existing = await prisma.transaction.findUnique({
      //   where: { txHash: txHash },
      // });
      // if (existing) return;
      //what backend decided
      return {
        success: true,
        message: 'Deposit saved successfully',
        depositId: deposit.id,
        txHash: txHash,
        status: deposit.status,
        // data: {
        //   // traderId: updatedDeposit.traderId,
        //   token: deposit.token,
        //   amount: deposit.amount.toString(),
        // },
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
