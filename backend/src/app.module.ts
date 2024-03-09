import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './typeorm/entities/Category';
import { Order } from './typeorm/entities/Order';
import { OrderedProduct } from './typeorm/entities/OrderedProduct';
import { OrderStatus } from './typeorm/entities/OrderStatus';
import { Product } from './typeorm/entities/Product';
import { User } from './typeorm/entities/User';
import { UserAddress } from './typeorm/entities/UserAddress';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrdersstatusesModule } from './ordersstatuses/ordersstatuses.module';

@Module({
  imports: [
    ConfigModule.forRoot(), TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Category, Order, OrderedProduct, OrderStatus, Product, User, UserAddress],
      synchronize: true,
      autoLoadEntities: true,
    }), UsersModule, AuthModule, CategoriesModule, ProductsModule, OrdersModule, OrdersstatusesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
