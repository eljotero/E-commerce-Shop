import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../typeorm/entities/Order';
import { User } from '../typeorm/entities/User';
import { OrderStatus } from '../typeorm/entities/OrderStatus';
import { OrdersstatusesService } from '../ordersstatuses/services/ordersstatuses.service';
import { UsersService } from '../users/services/users.service';
import { ProductsService } from '../products/services/products.service';
import { Product } from '../typeorm/entities/Product';
import { UserAddressesService } from '../useraddresses/services/useraddresses.service';
import { CategoriesService } from '../categories/services/categories.service';
import { UserAddress } from '../typeorm/entities/UserAddress';
import { Category } from '../typeorm/entities/Category';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, OrderStatus, Product, UserAddress, Category])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersstatusesService, UsersService, OrdersService, ProductsService, UserAddressesService, CategoriesService]
})
export class OrdersModule { }
