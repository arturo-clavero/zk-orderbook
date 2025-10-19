import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepositModule } from './deposit/deposit-module';
import { AccountModule } from './account/account-module';

@Module({
  imports: [DepositModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
