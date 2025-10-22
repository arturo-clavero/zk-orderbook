import { Module } from '@nestjs/common';
import { DepositController } from '../deposit/deposit-controller';

@Module({
  controllers: [DepositController],
})
export class DepositModule {}
