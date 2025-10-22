/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { prisma } from '../../lib/prisma-trading-database/prisma-trading';

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) {}

  //new order created and this should be called immidiatly
  async matchOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      throw new Error('order not founf');
    }
    const isBuy = order.side === 'BUY';
    const oppositeSide = isBuy ? 'BUY' : 'SELL';
    //find opposite sides
    const oppositeOrders = await prisma.order.findMany({
      where: {
        side: oppositeSide,
        buy_currency: order.buy_currency,
        sell_currency: order.sell_currency,
        amount: order.amount,
        price: order.price,
      },
      orderBy: [
        {
          price: isBuy ? 'asc' : 'desc',
        },
        { created: 'asc' },
      ],
    });
    //partial feels if order comes not at first time
    let remainingAmount = BigInt(order.amount) - BigInt(order.filled);

    //matching
    for (const opp of oppositeOrders) {
      if (remainingAmount <= 0n) break;
      //is price overlap?
      const validPrice = isBuy
        ? BigInt(order.price) >= BigInt(opp.price) //buy order
        : BigInt(order.price) <= BigInt(opp.price); //sell

      if (!validPrice) continue;

      //can be filled?
      const availableOpp = BigInt(opp.amount) - BigInt(order.filled); // if opposote is tryong to fill his full order too
      const fillAmount =
        remainingAmount < availableOpp ? remainingAmount : availableOpp;

      //trading
      await this.prisma.trade.create({
        data: {
          buyOrderId: isBuy ? order.id : opp.id,
          sellOrderId: isBuy ? opp.id : order.id,
          amount: fillAmount,
          price: opp.price,
        },
      });

      //update filled amounts
      const newOppFilled = BigInt(opp.filled) + fillAmount;
      const newOrderFilled = BigInt(order.filled) + fillAmount;
      await prisma.order.update({
        where: {
          id: opp.id,
        },
        data: {
          filled: newOppFilled,
          order_status:
            newOppFilled === BigInt(opp.amount) ? 'FILLED' : 'PARTIAL',
        },
      });
      order.filled = newOrderFilled;
      remainingAmount = BigInt(order.amount) - newOrderFilled;

      //update current order
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          filled: order.filled,
          order_status:
            BigInt(order.filled) === BigInt(order.amount)
              ? 'FILLED'
              : order.filled > 0n
                ? 'PARTIAL'
                : 'PENDING',
        },
      });
    }
  }
}
