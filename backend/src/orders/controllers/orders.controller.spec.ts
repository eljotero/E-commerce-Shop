import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../services/orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrders = [{
    orderId: 1,
    orderDate: new Date().setHours(new Date().getHours() - 2),
    totalPrice: 59.99,
    totalWeight: 800.01
  }, {
    orderId: 2,
    orderDate: new Date().setHours(new Date().getHours() - 1),
    totalPrice: 69.55,
    totalWeight: 650.59
  }];

  const mockOrder = {
    orderId: 3,
    orderDate: new Date(),
    totalPrice: 69.55,
    totalWeight: 650.59,
    User: {
      userName: 'James',
      userID: 5
    },
    orderStatus: 1
  }

  const mockOrdersService = {
    findAllOrders: jest.fn().mockResolvedValueOnce([mockOrders]),
    findOrderByID: jest.fn().mockResolvedValueOnce(mockOrder),
    findUserOrders: jest.fn().mockResolvedValueOnce(mockOrder),
    createNewOrder: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto
      }
    }),
    findOrdersByStatus: jest.fn().mockResolvedValueOnce(mockOrder),
    findUserOrdersByStatus: jest.fn().mockResolvedValueOnce(mockOrder)

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService]
    }).overrideProvider(OrdersService).useValue(mockOrdersService).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const result = await controller.getAllOrders();
      expect(mockOrdersService.findAllOrders).toHaveBeenCalled();
      expect(result).toEqual([mockOrders]);
    })
  });

  describe('getOrderById', () => {
    it('should return get order by id', async () => {
      const result = await controller.getOrderById(mockOrder.orderId);
      expect(mockOrdersService.findOrderByID).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    })
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      const result = await controller.getUserOrders(mockOrder.User.userName);
      expect(mockOrdersService.findUserOrders).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    })
  });

  describe('createOrder', () => {
    it('should create order', async () => {
      const dto = {
        username: 'exampleUsername',
        orderStatus: 1,
        orderedProducts: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
      };
      expect(controller.createOrder(dto)).toEqual({
        id: expect.any(Number),
        username: 'exampleUsername',
        orderStatus: 1,
        orderedProducts: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
      });
      expect(mockOrdersService.createNewOrder).toHaveBeenCalled();
    })
  });

  describe('getOrdersByStatus', () => {
    it('should get orders by status', async () => {
      const result = await controller.getOrdersByStatus(mockOrder.orderStatus);
      expect(mockOrdersService.findOrdersByStatus).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    })
  });

  describe('getUserOrdersByStatus', () => {
    it('should return user orders by status', async () => {
      const result = await controller.getUserOrdersByStatus(mockOrder.orderStatus, mockOrder.User.userID);
      expect(mockOrdersService.findUserOrdersByStatus).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    })
  });

});
