import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {
    }

    @Get()
    getAllOrders() {
        return this.ordersService.findAllOrders()
    }

    @Get(':id')
    getOrderById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOrderByID(id);
    }

    @Get('/name/:name')
    getUserOrders(@Param('name') name: string) {
        return this.ordersService.findUserOrders(name);
    }

    @Post()
    createOrder(@Body(new ValidationPipe()) createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(createOrderDto);
    }

    @Get('/status/:id')
    getOrdersByStatus(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOrdersByStatus(id);
    }

}
