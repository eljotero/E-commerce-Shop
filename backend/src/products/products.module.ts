import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../typeorm/entities/Product';
import { Category } from '../typeorm/entities/Category';
import { CategoriesService } from '../categories/services/categories.service';
import { OrdersService } from '../orders/services/orders.service';
import { OrderStatus } from '../typeorm/entities/OrderStatus';
import { Order } from '../typeorm/entities/Order';
import { UsersService } from '../users/services/users.service';
import { OrdersstatusesService } from '../ordersstatuses/services/ordersstatuses.service';
import { User } from '../typeorm/entities/User';
import { UserAddressesService } from '../useraddresses/services/useraddresses.service';
import { UserAddress } from '../typeorm/entities/UserAddress';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderStatus, Order, User, UserAddress])],
  providers: [ProductsService, CategoriesService, OrdersService, UsersService, OrdersstatusesService, UserAddressesService],
  controllers: [ProductsController]
})
export class ProductsModule { }
