import { Test, TestingModule } from '@nestjs/testing';
import { OrdersstatusesService } from './ordersstatuses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderStatus, OrderStatusEnum } from '../../typeorm/entities/OrderStatus';
import exp from 'constants';
import { HttpException } from '@nestjs/common';

describe('OrdersstatusesService', () => {
  let service: OrdersstatusesService;

  let mockOrdersStatuses = [{
    orderStatusId: 1,
    status: 'unapproved'
  }, {
    orderStatusId: 2,
    status: 'approved'
  }];

  let mockOrderStatus = {
    orderStatusId: 2,
    status: 'canceled'
  }

  let mockOrdersStatusesRepository = {
    findOne: jest.fn().mockResolvedValueOnce(mockOrderStatus),
    find: jest.fn().mockResolvedValueOnce(mockOrdersStatuses)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersstatusesService, {
        provide: getRepositoryToken(OrderStatus),
        useValue: mockOrdersStatusesRepository
      }],
    }).compile();

    service = module.get<OrdersstatusesService>(OrdersstatusesService);
  });

  describe('findOrderStatus', () => {
    it('should find order status', async () => {
      const result = await service.findOrderStatus(mockOrderStatus.orderStatusId);
      expect(mockOrdersStatusesRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockOrderStatus);
    });
  });

  describe('findAllOrdersStatuses', () => {
    it('should find all orders statuses', async () => {
      const result = await service.findAllOrdersStatuses();
      expect(mockOrdersStatusesRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrdersStatuses);
    });
  });

});
