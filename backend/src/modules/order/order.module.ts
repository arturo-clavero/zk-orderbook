import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MatchingService } from 'src/services/matching/matching.service';

@Module({
  providers: [PrismaService, OrderService, MatchingService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
