import { Module } from '@nestjs/common';
import { OrdersstatusesService } from './services/ordersstatuses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatus } from 'src/typeorm/entities/OrderStatus';
import { OrdersstatusesController } from './controllers/ordersstatuses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus])],
  providers: [OrdersstatusesService],
  controllers: [OrdersstatusesController]
})
export class OrdersstatusesModule { }
