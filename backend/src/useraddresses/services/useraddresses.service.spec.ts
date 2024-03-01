import { Test, TestingModule } from '@nestjs/testing';
import { UserAddressesService } from '../../useraddresses/services/useraddresses.service';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { UserAddress } from '../../typeorm/entities/UserAddress';

describe('UseraddressesService', () => {
  let service: UserAddressesService;

  let mockCreateUserAddressDto = {
    zipCode: 'SASD',
    city: 'asdasd',
    country: 'asdasd',
    address: 'tesst'
  };


  let mockEntityManager = {
    transaction: jest.fn().mockImplementation((callback: any) => {
      return callback(mockEntityManager);
    }),
    insert: jest.fn().mockImplementation(dto => {
      return {
        userAddressId: Date.now(),
        ...dto
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAddressesService, {
        provide: getEntityManagerToken(),
        useValue: mockEntityManager
      }],
    }).compile();

    service = module.get<UserAddressesService>(UserAddressesService);
  });

  describe('createUserAddress', () => {
    it('should create user address', async () => {
      await service.createUserAddress(mockCreateUserAddressDto);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.insert).toHaveBeenCalledWith(UserAddress, mockCreateUserAddressDto);
      expect(mockEntityManager.insert).toHaveBeenCalled();
    });
  });
});
