import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  providers: [PrismaService, OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
