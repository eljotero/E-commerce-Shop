import { Test, TestingModule } from '@nestjs/testing';
import { UseraddressesService } from './useraddresses.service';

describe('UseraddressesService', () => {
  let service: UseraddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UseraddressesService],
    }).compile();

    service = module.get<UseraddressesService>(UseraddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
