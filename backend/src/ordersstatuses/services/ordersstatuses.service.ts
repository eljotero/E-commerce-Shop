import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from '../../typeorm/entities/OrderStatus';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrdersstatusesService {
    constructor(@InjectRepository(OrderStatus) private ordersStatusesRepository: Repository<OrderStatus>, private entityManager: EntityManager) { }

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

}
