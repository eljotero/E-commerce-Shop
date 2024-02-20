import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { Category } from 'src/typeorm/entities/Category';
import { CategoriesService } from 'src/categories/services/categories.service';
import { OrdersService } from 'src/orders/services/orders.service';
import { OrderStatus } from 'src/typeorm/entities/OrderStatus';
import { Order } from 'src/typeorm/entities/Order';
import { UsersService } from 'src/users/services/users.service';
import { OrdersstatusesService } from 'src/ordersstatuses/services/ordersstatuses.service';
import { User } from 'src/typeorm/entities/User';
import { UserAddressesService } from 'src/useraddresses/services/useraddresses.service';
import { UserAddress } from 'src/typeorm/entities/UserAddress';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderStatus, Order, User, UserAddress])],
  providers: [ProductsService, CategoriesService, OrdersService, UsersService, OrdersstatusesService, UserAddressesService],
  controllers: [ProductsController]
})
export class ProductsModule { }
