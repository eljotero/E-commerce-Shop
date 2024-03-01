import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../services/orders.service';
import { UserRoles } from '../../auth/enums/user-roles';
import { HttpException } from '@nestjs/common';
import { UpdateOrderDto } from '../../orders/dtos/UpdateOrder.dto';

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
      userID: 5,
      UserRoles: UserRoles.User
    },
    orderStatus: 1
  }

  const mockOrdersService = {
    findAllOrders: jest.fn().mockResolvedValueOnce(mockOrders),
    findOrderByID: jest.fn().mockResolvedValueOnce(mockOrder),
    findUserOrders: jest.fn().mockResolvedValueOnce(mockOrder),
    createNewOrder: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto
      }
    }),
    findOrdersByStatus: jest.fn().mockResolvedValueOnce(mockOrder),
    updateOrderById: jest.fn(),
    changeOrderStatus: jest.fn()
  }

  const mockUser = {
    userName: 'User',
    userID: 6,
    UserRoles: UserRoles.User
  };

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
      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    it('should return get order by id', async () => {
      const result = await controller.getOrderById(mockOrder.orderId);
      expect(mockOrdersService.findOrderByID).toHaveBeenCalledWith(mockOrder.orderId);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      const mockReq = {
        user: mockOrder.User,
      }
      const orderStatusID: number = 1
      const result = await controller.getUserOrders(mockReq, mockOrder.User.userName, orderStatusID);
      expect(mockOrdersService.findUserOrders).toHaveBeenCalledWith(mockOrder.User.userName, orderStatusID);
      expect(result).toEqual(mockOrder);
    });

    it('should not return user orders', async () => {
      const mockReq = {
        user: mockUser
      }
      try {
        await controller.getUserOrders(mockReq, mockOrder.User.userName, undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    })
  });

  describe('createOrder', () => {
    it('should create order', async () => {
      const mockReq = {
        user: {
          userName: 'exampleUsername',
          roles: UserRoles.User
        }
      }
      const dto = {
        username: 'exampleUsername',
        orderStatus: 1,
        orderedProducts: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
      };
      expect(controller.createOrder(mockReq, dto)).toEqual({
        id: expect.any(Number),
        username: 'exampleUsername',
        orderStatus: 1,
        orderedProducts: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
      });
      expect(mockOrdersService.createNewOrder).toHaveBeenCalledWith(dto);
    });

    it('should not create order', async () => {
      const mockReq = {
        user: mockUser
      }
      const dto = {
        username: 'exampleUsername',
        orderStatus: 1,
        orderedProducts: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
      }
      try {
        controller.createOrder(mockReq, dto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('getOrdersByStatus', () => {
    it('should get orders by status', async () => {
      const result = await controller.getOrdersByStatus(mockOrder.orderStatus);
      expect(mockOrdersService.findOrdersByStatus).toHaveBeenCalledWith(mockOrder.orderStatus);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateOrderStatus', () => {
    it('should change order status', async () => {
      const updatedOrder = { ...mockOrder, orderStatus: 2 };
      const mockOrderStatusID: number = 2;
      mockOrdersService.changeOrderStatus = jest.fn().mockResolvedValueOnce(updatedOrder);
      const result = await controller.updateOrderStatus(mockOrder.orderId, mockOrderStatusID);
      expect(mockOrdersService.changeOrderStatus).toHaveBeenCalledWith(mockOrder.orderId, mockOrderStatusID);
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('update order', () => {
    it('should update order', async () => {
      const updatedOrder = { ...mockOrder, totalPrice: 599.55 };
      mockOrdersService.updateOrderById = jest.fn().mockResolvedValueOnce(updatedOrder);
      const result = await controller.updateOrder(updatedOrder.orderId, updatedOrder as unknown as UpdateOrderDto);
      expect(mockOrdersService.updateOrderById).toHaveBeenCalledWith(updatedOrder.orderId, updatedOrder as unknown as UpdateOrderDto);
      expect(result).toEqual(updatedOrder);
    })
  })
});
