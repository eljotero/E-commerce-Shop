import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  let mockUsersService = {};

  let mockAuthService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [UsersService, AuthService]
    }).overrideProvider(UsersService).useValue(mockUsersService).overrideProvider(AuthService).useValue(mockAuthService).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
