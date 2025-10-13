/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { prisma } from '../lib/prisma-trading-database/prisma-trading';

@Controller('deposit')
export class DepositController {
  @Post()
  async handleDeposit(@Body() dataFrontend: any) {
    const { traderId, token, amount } = dataFrontend;
    let searchForTrader = await prisma.trader.findUnique({
      where: {
        address: traderId,
      },
    });
    if (!searchForTrader) {
      searchForTrader = await prisma.trader.create({
        data: { address: traderId },
      });
      return {
        success: false,
        message: 'account was created for you need to verify kyc',
      };
    }
    try {
      //kyc if it will be time
      if (!traderId || !token || !amount) {
        return {
          success: false,
          message: 'Missing data',
        };
      }
      console.log('received from frontend', dataFrontend);
      // to db
      const deposit = await prisma.transaction.create({
        data: {
          type: 'deposit',
          traderId,
          token,
          amount: Number(dataFrontend.amount),
          status: 'Pending',
          txHash: null,
        },
      });
      console.log('Saved to dataabase wtih id', deposit.id);
      //transaction hash simulation
      const fakeTxHash = `0x${Math.random().toString(16).slice(2, 64)}`;
      //update database
      const updatedDeposit = await prisma.transaction.update({
        where: { id: deposit.id },
        data: {
          status: 'Confirmed',
          txHash: fakeTxHash,
        },
      });
      //what backend decided
      return {
        success: true,
        message: 'Deposit saved successfully',
        depositId: updatedDeposit.id,
        txHash: fakeTxHash,
        status: updatedDeposit.status,
        data: {
          // traderId: updatedDeposit.traderId,
          token: updatedDeposit.token,
          amount: updatedDeposit.amount.toString(),
        },
      };
    } catch (err) {
      console.error('Error iccured', err);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }
}
