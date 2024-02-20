import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UserAddressesService } from 'src/useraddresses/services/useraddresses.service';
import { UserAddress } from 'src/typeorm/entities/UserAddress';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAddress])
  ],
  controllers: [UsersController],
  providers: [UsersService, UserAddressesService],
})
export class UsersModule { }
