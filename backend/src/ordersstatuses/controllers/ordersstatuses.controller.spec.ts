import { Test, TestingModule } from '@nestjs/testing';
import { OrdersstatusesController } from './ordersstatuses.controller';

describe('OrdersstatusesController', () => {
  let controller: OrdersstatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersstatusesController],
    }).compile();

    controller = module.get<OrdersstatusesController>(OrdersstatusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
