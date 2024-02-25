import { Test, TestingModule } from '@nestjs/testing';
import { OrdersstatusesController } from './ordersstatuses.controller';
import { OrdersstatusesService } from '../services/ordersstatuses.service';

describe('OrdersstatusesController', () => {
  let controller: OrdersstatusesController;

  const mockOrdersStatuses = [{
    orderStatusId: 1,
    orderStatus: 'CANCELED'
  }, {
    orderStatusId: 2,
    orderStatus: 'APPROVED'
  }]

  const mockOrdersStatusesService = {
    findAllOrdersStatuses: jest.fn().mockResolvedValueOnce([mockOrdersStatuses])
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersstatusesController],
      providers: [OrdersstatusesService]
    }).overrideProvider(OrdersstatusesService).useValue(mockOrdersStatusesService).compile();

    controller = module.get<OrdersstatusesController>(OrdersstatusesController);
  });

  describe('getAllOrdersStatuses', () => {
    it('should return all orders statuses', async () => {
      const result = await controller.getAllOrdersStatuses();
      expect(mockOrdersStatusesService.findAllOrdersStatuses).toHaveBeenCalled();
      expect(result).toEqual([mockOrdersStatuses]);
    })
  })
});
