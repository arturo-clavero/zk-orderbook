/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { prisma } from '../../lib/prisma-trading-database/prisma-trading';
import { ethers } from 'ethers';

const PYUSD_ADDRESS = process.env.PYUSD_ADDRESS?.toLowerCase() ?? '';
const USDT_ADDRESS = process.env.USDT_ADDRESS?.toLowerCase() ?? '';
const ETH_ADDRESS = process.env.ETH_ADDRESS?.toLowerCase() ?? '';

export const TOKEN_MAP: Record<string, string> = {
  [PYUSD_ADDRESS]: 'PYUSD',
  [USDT_ADDRESS]: 'USDT',
  [ETH_ADDRESS]: 'ETH',
};

@Controller('deposit')
export class DepositController {
  @Post()
  async handleDeposit(@Body() dataEnvio: any) {
    let { wallet, token, rawAmount, txHash } = dataEnvio;
    console.log('wallet', wallet);
    wallet = wallet.toLowerCase();
    token = token.toLowerCase();

    console.log('data which backend recevies is in the deposit', dataEnvio);
    if (!wallet || !token || !rawAmount || !txHash) {
      return {
        success: false,
        message: 'Missing data',
      };
    }
    //find trader
    const trader = await prisma.trader.upsert({
      where: { address: wallet },
      create: { address: wallet },
      update: {},
    });
    console.log('Trader which was  found is ', trader);
    const currency = TOKEN_MAP[token] || token;
    console.log('Currency is ', currency);
    console.log('Trder.id id', trader.id);
    console.log('trader address', trader.address);
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
      const decimals = currency === 'ETH' ? 18 : 6;
      const humanAmount = ethers.formatUnits(rawAmount.toString(), decimals);
      const deposit = await prisma.transaction.upsert({
        where: { txHash },
        create: {
          type: 'deposit',
          traderId: trader.id,
          token,
          rawAmount,
          humanAmount,
          status: txHash ? 'Confirmed' : 'Pending',
          txHash: txHash || null,
        },
        update: {},
      });
      if (deposit.status === 'Confirmed') {
        await prisma.account.update({
          where: { id: account.id },
          data: {
            available: { increment: rawAmount },
          },
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
