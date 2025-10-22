import { Test, TestingModule } from '@nestjs/testing';
import { OrderGateway } from './order.gateway';

describe('OrdersGateway', () => {
  let gateway: OrderGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderGateway],
    }).compile();

    gateway = module.get<OrderGateway>(OrderGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
