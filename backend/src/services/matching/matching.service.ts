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
      include: {
        trader: true,
      },
    });
    console.log('The order id is: ', order);
    if (!order) {
      throw new Error('order not founf');
    }
    //===loogs===//
    console.log('🆕 NEW ORDER RECEIVED:');
    console.log({
      id: order.id,
      trader: order.traderId,
      side: order.side,
      buy_currency: order.buy_currency,
      sell_currency: order.sell_currency,
      price: order.price,
      filled: order.filled,
    });
    ////////////////////
    const isBuy = order.side === 'buy';
    const oppositeSide = isBuy ? 'sell' : 'buy';

    //===loogs===//
    console.log(`🔄 Searching for opposite side orders (${oppositeSide})...`);

    //find opposite sides
    let oppositeOrders = await prisma.order.findMany({
      where: {
        side: oppositeSide,
        buy_currency: order.sell_currency,
        order_status: { in: ['PENDING', 'PARTIAL'] },
        sell_currency: order.buy_currency,
        price: isBuy
          ? { lte: order.price } //buyer pays >= sellers price
          : { gte: order.price }, // sellers <= buyers price
      },
      orderBy: [
        {
          price: isBuy ? 'asc' : 'desc',
        },
        { created: 'asc' },
      ],
    });
    if (oppositeOrders.length === 0) {
      oppositeOrders = await prisma.order.findMany({
        where: {
          side: 'buy',
          buy_currency: order.sell_currency,
          order_status: { in: ['PENDING', 'PARTIAL'] },
          sell_currency: order.buy_currency,
          price: { lte: order.price }, //buyer pays >= sellers price
        },
      });
    }
    console.log('Opposite orders: ', oppositeOrders);
    //partial feels if order comes not at first time
    let remainingAmount = BigInt(order.amount) - BigInt(order.filled);

    //matching
    for (const opp of oppositeOrders) {
      if (remainingAmount <= 0n) break;
      //is price overlap?
      const validPrice = isBuy
        ? BigInt(order.price) >= BigInt(opp.price) //buyers want to pay more than seller asks
        : BigInt(order.price) <= BigInt(opp.price); //sellers want to sell less than buyers wants

      if (!validPrice) continue;

      //can be filled?
      const availableOpp = BigInt(opp.amount) - BigInt(opp.filled); // if opposote is tryong to fill his full order too
      if (availableOpp <= 0n) continue;
      const fillAmount =
        remainingAmount < availableOpp ? remainingAmount : availableOpp;

      //===loogs===//
      console.log('💥 MATCH FOUND!');
      console.log({
        buyer: isBuy ? order.traderId : opp.traderId,
        seller: isBuy ? opp.traderId : order.traderId,
        buyPrice: order.price,
        sellPrice: opp.price,
        fillAmount: fillAmount.toString(),
      });
      ////////////////////

      //trading
      await this.prisma.trade.create({
        data: {
          buyOrderId: isBuy ? order.id : opp.id,
          sellOrderId: isBuy ? opp.id : order.id,
          amount: fillAmount,
          price: opp.price,
        },
      });
      //update balances
      const buyerId = isBuy ? order.traderId : opp.traderId;
      const sellerId = isBuy ? opp.traderId : order.traderId;
      const buyCurrency = order.buy_currency;
      const sellCurrency = order.sell_currency;
      const totalCost = BigInt(opp.price) * fillAmount;

      //===loogs===//
      console.log(`💰 Updating balances:`);
      console.log({
        buyer: buyerId,
        seller: sellerId,
        buyCurrency,
        sellCurrency,
        totalCost: totalCost.toString(),
      });
      //////////////////////

      //Buyer receives
      await prisma.account.updateMany({
        where: {
          traderId: buyerId,
          currency: buyCurrency,
        },
        data: {
          available: { increment: fillAmount },
        },
      });
      await prisma.account.updateMany({
        where: {
          traderId: sellerId,
          currency: sellCurrency,
        },
        data: {
          available: { increment: totalCost },
        },
      });
      //Seller receives
      //update filled amounts
      const newOppFilled = BigInt(opp.filled) + fillAmount;
      const newOrderFilled = BigInt(order.filled) + fillAmount;

      //===loogs===//
      console.log(`🧾 Updating order statuses...`);
      console.log({
        orderId: order.id,
        newOrderFilled: newOrderFilled.toString(),
        oppOrderId: opp.id,
        newOppFilled: newOppFilled.toString(),
      });
      ///////////////////

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
      console.log(`✅ TRADE COMPLETED between ${buyerId} and ${sellerId}`);
      console.log('---------------------------------------------');
    }
    console.log(`🏁 Matching process finished for order ${order.id}`);
  }
}
