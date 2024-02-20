import { Test, TestingModule } from '@nestjs/testing';
import { OrdersstatusesService } from './ordersstatuses.service';

describe('OrdersstatusesService', () => {
  let service: OrdersstatusesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersstatusesService],
    }).compile();

    service = module.get<OrdersstatusesService>(OrdersstatusesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
