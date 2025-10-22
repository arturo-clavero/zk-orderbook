/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { prisma } from '../../lib/prisma-trading-database/prisma-trading';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async createOrder(dto: any) {
    const { walletAddress, buy_currency, sell_currency, amount, price } = dto;

    const trader = await prisma.trader.findUnique({
      where: {
        address: walletAddress,
      },
    });
    if (!trader) {
      throw new Error('Trader not found - need to register first');
    }
    const order = await prisma.order.create({
      data: {
        traderId: trader.id,
        buy_currency,
        sell_currency,
        amount,
        price,
        order_status: 'pending',
      },
    });
    return { orderId: order.id, status: order.order_status };
  }
}
