import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus, OrderStatusEnum } from '../../typeorm/entities/OrderStatus';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersstatusesService {
    constructor(@InjectRepository(OrderStatus) private ordersStatusesRepository: Repository<OrderStatus>) { }

    async findOrderStatus(orderStatusID: number) {
        const orderStatus = await this.ordersStatusesRepository.findOne({
            where: {
                orderStatusId: orderStatusID
            }
        });
        if (!orderStatus) {
            throw new HttpException('There is no such order status', HttpStatus.BAD_REQUEST);
        }
        return orderStatus;
    }

    async findAllOrdersStatuses() {
        return await this.ordersStatusesRepository.find();
    }

    async validateOrderStatus(orderStatus: OrderStatus, newOrderStatus: OrderStatus) {
        if (orderStatus.status === OrderStatusEnum.DELIVERED) {
            throw new HttpException('Order is already delivered', HttpStatus.BAD_REQUEST);
        } else if (orderStatus.status === newOrderStatus.status) {
            throw new HttpException('New order status is same as old order status', HttpStatus.CONFLICT);
        } else if (orderStatus.status === OrderStatusEnum.APPROVED && newOrderStatus.status === OrderStatusEnum.UNAPPROVED) {
            throw new HttpException('Order is already approved', HttpStatus.BAD_REQUEST);
        } else if (orderStatus.status === OrderStatusEnum.CANCELED) {
            throw new HttpException('Order is already canceled', HttpStatus.BAD_REQUEST);
        }
        return true;
    }

}
