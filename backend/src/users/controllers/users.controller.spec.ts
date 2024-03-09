import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsers = [{
    userID: 1,
    userLogin: 'testLogin',
    userFirstName: 'testFirstName',
    userLastName: 'testLastName',
    userPassword: 'pass123',
    userEmail: 'test@mail.com',
    userPhone: '123456789'
  },
  {
    userID: 2,
    userLogin: 'testLogin2',
    userFirstName: 'testFirstName2',
    userLastName: 'testLastName2',
    userPassword: 'pass1234',
    userEmail: 'test1@mail.com',
    userPhone: '123456788'
  }];

  const mockUser = {
    userId: 3,
    userLogin: 'testLogin3',
    userFirstName: 'testFirstName3',
    userLastName: 'testLastName3',
    userPassword: 'pass1235',
    userEmail: 'test2@mail.com',
    userPhone: '323456789'
  };

  const mockUsersService = {
    findUsers: jest.fn().mockResolvedValue(mockUsers),
    findUserById: jest.fn().mockResolvedValueOnce(mockUser),
    createUser: jest.fn((dto) => {
      return {
        userId: Date.now(),
        ...dto
      }
    }),
    updateUser: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService]
    }).overrideProvider(UsersService).useValue(mockUsersService).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getUsers', () => {
    it('should get users', async () => {
      const result = await controller.getUsers();
      expect(mockUsersService.findUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  /*
  describe('getUserById', () => {
    it('should get user by id', async () => {
      const mockReq = {
        user: mockUser
      }
      const result = await controller.getUserById(mockReq, mockUser.userId);
      expect(mockUsersService.findUserById).toHaveBeenCalled();
      expect(result).toEqual(mockUser)
    });
  });
  */

  describe('createUser', () => {
    it('should create user', async () => {
      const dto = {
        userLogin: 'testLogin4',
        userFirstName: 'testFirstName4',
        userLastName: 'testLastName4',
        userPassword: 'pass1236',
        userEmail: 'test3@mail.com',
        userPhone: '323455789',
        zipCode: '22-222',
        city: 'Warsaw',
        country: 'Poland',
        address: 'Test 5'
      };
      expect(await controller.createUser(dto)).toEqual({
        userId: expect.any(Number),
        userLogin: 'testLogin4',
        userFirstName: 'testFirstName4',
        userLastName: 'testLastName4',
        userPassword: 'pass1236',
        userEmail: 'test3@mail.com',
        userPhone: '323455789',
        zipCode: '22-222',
        city: 'Warsaw',
        country: 'Poland',
        address: 'Test 5'
      });
      expect(mockUsersService.createUser).toHaveBeenCalled();
    });
  });

  /*
  describe('updateUser', () => {
    it('should update user', async () => {
      const mockReq = {
        user: mockUser
      }
      const updatedUser = { ...mockUser, userLogin: 'newUserLogin' };
      const user = {
        userFirstName: 'testFirstName3',
        userLastName: 'testLastName3',
        userPassword: 'pass1235',
        userEmail: 'test2@mail.com',
        userPhone: '323456789',
        zipCode: '22-222',
        city: 'Warsaw',
        country: 'Poland',
        address: 'Test 5'
      };
      mockUsersService.updateUser = jest.fn().mockResolvedValueOnce(updatedUser);
      const result = await controller.updateUser(mockReq, mockUser.userLogin, user as UpdateUserDto);
      expect(mockUsersService.updateUser).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });
  });

});
