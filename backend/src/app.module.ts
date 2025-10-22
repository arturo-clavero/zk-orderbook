import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepositModule } from './modules/deposit/deposit-module';
import { AccountModule } from './modules/account/account-module';
import { OrderGateway } from './modules/order/order.gateway';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [DepositModule, AccountModule, OrderModule],
  controllers: [AppController],
  providers: [AppService, OrderGateway],
})
export class AppModule {}
