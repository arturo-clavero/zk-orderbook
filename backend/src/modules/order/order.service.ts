/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { prisma } from '../../lib/prisma-trading-database/prisma-trading';
import { MatchingService } from 'src/services/matching/matching.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private matchingService: MatchingService,
  ) {}
  async createOrder(dto: any) {
    const { side, walletAddress, buy_currency, sell_currency, amount, price } =
      dto;

    const trader = await prisma.trader.findUnique({
      where: {
        address: walletAddress,
      },
    });
    if (!trader) {
      throw new Error('Trader not found - need to register first');
    }
    //cooool prisma atomic transaction feature
    const order = await prisma.$transaction(async (tx) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (side.toLowerCase() === 'sell') {
        const sellAccount = await tx.account.findUnique({
          where: {
            traderId_currency: {
              traderId: trader.id,
              currency: sell_currency,
            },
          },
        });

        if (!sellAccount) {
          throw new Error(`Transaction was not founf fp ${sell_currency}`);
        }
        if (BigInt(sellAccount.available) < BigInt(amount)) {
          throw new Error('Not enough tokens on your balance');
        }
        //lock if balance is good to have deal with
        await tx.account.update({
          where: { id: sellAccount.id },
          data: {
            available: BigInt(sellAccount.available) - BigInt(amount),
            locked: BigInt(sellAccount.locked) + BigInt(amount),
          },
        });
      }
      //order creatin
      return await prisma.order.create({
        data: {
          side,
          traderId: trader.id,
          buy_currency,
          sell_currency,
          amount,
          price,
          order_status: 'PENDING',
        },
      });
    });

    await this.matchingService.matchOrder(order.id);
    console.log('i went through the matchiong service for order: ', order.id);
    return {
      orderId: order.id,
      status: order.order_status,
      message: 'order created and sended for matching',
    };
  }
}
