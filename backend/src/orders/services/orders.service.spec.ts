import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { UserRoles } from '../../auth/enums/user-roles';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../../typeorm/entities/Order';
import { UsersService } from '../../users/services/users.service';
import { OrdersstatusesService } from '../../ordersstatuses/services/ordersstatuses.service';
import { ProductsService } from '../../products/services/products.service';

describe('OrdersService', () => {
  let service: OrdersService;

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

  let mockOrdersRepository = {
    find: jest.fn().mockResolvedValue(mockOrders),
    findOne: jest.fn(),
  }

  let mockEntityManager = {
    transaction: jest.fn().mockImplementation((callback: any) => {
      return callback(mockEntityManager);
    }),
    insert: jest.fn(dto => {
      return {
        orderId: Date.now(),
        ...dto
      }
    }),
    remove: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn()
  }

  let mockUsersService = {
    findUserByLogin: jest.fn(),
    findUser: jest.fn()
  }

  let mockOrdersStatusesService = {
    findOrderStatus: jest.fn(),
    validateOrderStatus: jest.fn().mockResolvedValueOnce(true)
  }

  let mockProductsService = {
    findProductById: jest.fn()
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, {
        provide: getRepositoryToken(Order),
        useValue: mockOrdersRepository
      }, {
          provide: getEntityManagerToken(),
          useValue: mockEntityManager
        }, UsersService, OrdersstatusesService, ProductsService],
    }).overrideProvider(UsersService).useValue(mockUsersService).overrideProvider(OrdersstatusesService).useValue(mockOrdersStatusesService).overrideProvider(ProductsService).useValue(mockProductsService).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('findAllOrders', () => {
    it('should return all orders', async () => {
      const result = await service.findAllOrders();
      expect(mockOrdersRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findOrderByID', () => {
    it('should find order by id', async () => {
      mockOrdersRepository.findOne = jest.fn().mockResolvedValueOnce(mockOrder);
      const result = await service.findOrderByID(mockOrder.orderId);
      expect(mockOrdersRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findUserOrders', () => {
    it('should find user orders', async () => {
      const params = { userName: 'testUser', orderStatusID: 1 };
      const result = await service.findUserOrders(params.userName, params.orderStatusID);
      expect(mockOrdersStatusesService.findOrderStatus).toHaveBeenCalledWith(params.orderStatusID);
      expect(mockOrdersRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
    it('should also find user orders', async () => {
      const params = { userName: 'testUser', orderStatusID: undefined };
      const result = await service.findUserOrders(params.userName, params.orderStatusID);
      expect(mockOrdersStatusesService.findOrderStatus).toHaveBeenCalled();
      expect(mockOrdersRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('createNewOrder', () => {
    it('should create new order', async () => {
      mockProductsService.findProductById = jest.fn().mockResolvedValue({
        productId: 1,
        productName: "Product1",
        productPrice: 10,
        productWeight: 0.5
      });
      const dto = {
        username: "James",
        orderStatus: 2,
        orderedProducts: [
          {
            productId: 1,
            quantity: 2
          },
          {
            productId: 3,
            quantity: 1
          }
        ]
      };
      await service.createNewOrder(dto);
      expect(mockOrdersStatusesService.findOrderStatus).toHaveBeenCalledWith(dto.orderStatus);
      expect(mockUsersService.findUser).toHaveBeenCalledWith(dto.username);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockProductsService.findProductById).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
    })
  });

  describe('findOrdersByStatus', () => {
    it('should find orders by status', async () => {
      const orderStatusID: number = 1;
      const result = await service.findOrdersByStatus(orderStatusID);
      expect(mockOrdersStatusesService.findOrderStatus).toHaveBeenCalledWith(orderStatusID);
      expect(mockOrdersRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    })
  });

  describe('updateOrderById', () => {
    it('should update order by id', async () => {
      mockEntityManager.findOne = jest.fn().mockResolvedValueOnce(mockOrder);
      const oldOrder = {
        orderId: 999,
        username: "James",
        orderStatus: 2,
        orderedProducts: [
          {
            productId: 1,
            quantity: 2
          },
          {
            productId: 3,
            quantity: 1
          }
        ]
      };
      const updatedOrder = { ...oldOrder, orderStatus: 4 };
      mockEntityManager.save = jest.fn().mockResolvedValueOnce(updatedOrder);
      await service.updateOrderById(oldOrder.orderId, updatedOrder);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockOrdersStatusesService.findOrderStatus).toHaveBeenCalled();
      expect(mockProductsService.findProductById).toHaveBeenCalled();
    })
  });

  describe('changeOrderStatus', () => {
    it('should change order status', async () => {
      const updatedOrder = { ...mockOrder, orderStatus: 4 };
      mockEntityManager.findOne = jest.fn().mockResolvedValueOnce(mockOrder);
      mockEntityManager.save = jest.fn().mockResolvedValueOnce(updatedOrder);
      await service.changeOrderStatus(mockOrder.orderId, 4);
      expect(mockOrdersStatusesService.findOrderStatus).toHaveBeenCalled();
      expect(mockOrdersStatusesService.validateOrderStatus).toHaveBeenCalled();
    })
  });



});
