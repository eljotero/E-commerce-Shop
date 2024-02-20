import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/typeorm/entities/Order';
import { User } from 'src/typeorm/entities/User';
import { OrderStatus } from 'src/typeorm/entities/OrderStatus';
import { OrdersstatusesService } from 'src/ordersstatuses/services/ordersstatuses.service';
import { UsersService } from 'src/users/services/users.service';
import { ProductsService } from 'src/products/services/products.service';
import { Product } from 'src/typeorm/entities/Product';
import { UserAddressesService } from 'src/useraddresses/services/useraddresses.service';
import { CategoriesService } from 'src/categories/services/categories.service';
import { UserAddress } from 'src/typeorm/entities/UserAddress';
import { Category } from 'src/typeorm/entities/Category';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, OrderStatus, Product, UserAddress, Category])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersstatusesService, UsersService, OrdersService, ProductsService, UserAddressesService, CategoriesService]
})
export class OrdersModule { }
