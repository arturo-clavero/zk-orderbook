/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

//////======ADDED MATCHONG LOGIT TO THE FUNCTION SHOULR RETURN PENDNID PARTIALLY OR FILLED====/////
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
    const {
      tradeType,
      side,
      price,
      amount,
      chartPair,
      mainToken,
      quoteToken,
      slippage,
      ammFallBack,
      filled,
      timestamp,
      user,
      signature,
    } = dto;
    console.log(
      'what is not used add to database',
      slippage,
      ammFallBack,
      filled,
      timestamp,
    );

    const walletAddress = user;
    const trader = await prisma.trader.findUnique({
      where: {
        address: walletAddress,
      },
    });
    if (!trader) {
      throw new Error('Trader not found - need to register first');
    }
    //cooool prisma atomic transaction feature
    const result = await prisma.$transaction(async (tx) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (side.toLowerCase() === 'sell') {
        const sellAccount = await tx.account.findUnique({
          where: {
            traderId_currency: {
              traderId: trader.id,
              currency: quoteToken,
            },
          },
        });

        if (!sellAccount) {
          throw new Error(`Transaction was not founf fp ${quoteToken}`);
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
      const order = await prisma.order.create({
        data: {
          tradeType,
          chartPair,
          signature,
          side,
          traderId: trader.id,
          buy_currency: mainToken,
          sell_currency: quoteToken,
          amount,
          price,
          order_status: 'PENDING',
        },
      });
      await this.matchingService.matchOrder(order.id);
      console.log('i went through the matchiong service for order: ', order.id);
      const updatedOrder = await prisma.order.findUnique({
        where: { id: order.id },
        select: { id: true, order_status: true, filled: true },
      });
      if (!updatedOrder) {
        throw new Error('Order not found after matching');
      }
      return {
        orderId: updatedOrder.id,
        status: updatedOrder.order_status,
        message: 'order created and matched',
      };
    });
    return result;
  }
}
