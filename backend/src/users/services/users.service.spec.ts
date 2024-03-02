import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserAddressesService } from '../../useraddresses/services/useraddresses.service';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../typeorm/entities/User';

describe('UsersService', () => {
  let service: UsersService;

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
    userID: 3,
    userLogin: 'testLogin3',
    userFirstName: 'testFirstName3',
    userLastName: 'testLastName3',
    userPassword: 'pass1235',
    userEmail: 'test2@mail.com',
    userPhone: '323456789'
  };

  const mockUser2 = {
    userID: 3,
    userLogin: 'testLogin3',
    userFirstName: 'testFirstName3',
    userLastName: 'testLastName3',
    userEmail: 'test2@mail.com',
    userPhone: '323456789'
  };

  const mockUser3 = {
    userLogin: 'testLogin3',
    userFirstName: 'testFirstName3',
    userLastName: 'testLastName3',
    userPassword: 'pass1235',
    userEmail: 'test2@mail.com',
    userPhone: '323456789',
    zipCode: '123123',
    city: '12312',
    country: '12312',
    address: '123123'
  };

  const mockUserAddressesService = {
    createUserAddress: jest.fn()
  };

  const mockEntityManager = {
    transaction: jest.fn().mockImplementation((callback: any) => {
      return callback(mockEntityManager);
    }),
    findOne: jest.fn().mockResolvedValueOnce(null),
    save: jest.fn(dto => {
      return {
        userID: Date.now(),
        ...dto
      }
    })
  };

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest.fn().mockResolvedValue(mockUser)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UserAddressesService, {
        provide: getEntityManagerToken(),
        useValue: mockEntityManager
      }, {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }],
    }).overrideProvider(UserAddressesService).useValue(mockUserAddressesService).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findUsers', () => {
    it('should find all users', async () => {
      const result = await service.findUsers();
      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers.map(({ userPassword, ...user }) => user));
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      const result = await service.findUserById(mockUser.userID);
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockUser2);
    });
  });

  describe('findUser', () => {
    it('should find user for order', async () => {
      const result = await service.findUser(mockUser.userLogin);
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserByLogin', () => {
    it('should find user by login', async () => {
      const result = await service.findUserByLogin(mockUser.userLogin);
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockUser2);
    });
  });

  describe('createUser', () => {
    it('should create user', async () => {
      await service.createUser(mockUser3);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockUserAddressesService.createUserAddress).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
    });
  });
});
