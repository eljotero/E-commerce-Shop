import { Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersstatusesService } from '../services/ordersstatuses.service';

@Controller('ordersstatuses')
export class OrdersstatusesController {
    constructor(private ordersStatusesService: OrdersstatusesService) { }

    @Get()
    getAllOrdersStatuses() {
        return this.ordersStatusesService.findAllOrdersStatuses();
    }
}
