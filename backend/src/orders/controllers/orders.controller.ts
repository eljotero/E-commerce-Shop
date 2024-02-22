import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {
    }

    @Get()
    getAllOrders() {
        return this.ordersService.findAllOrders()
    }

    @UseGuards(ACGuard, JwtAuthGuard)
    @UseRoles({
        possession: 'any',
        action: 'read',
        resource: 'orders'
    })
    @Get(':id')
    getOrderById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOrderByID(id);
    }

    @UseGuards(JwtAuthGuard, ACGuard)
    @UseRoles({
        possession: 'own',
        action: 'read',
        resource: 'orders'
    })
    @Get('/name/:name')
    getUserOrders(@Param('name') name: string) {
        return this.ordersService.findUserOrders(name);
    }

    @Post()
    @UseGuards(JwtAuthGuard, ACGuard)
    @UseRoles({
        possession: 'own',
        action: 'create',
        resource: 'orders'
    })
    createOrder(@Body(new ValidationPipe()) createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(createOrderDto);
    }

    @UseGuards(JwtAuthGuard, ACGuard)
    @UseRoles({
        possession: 'any',
        action: 'read',
        resource: 'orders'
    })
    @Get('/status/:id')
    getOrdersByStatus(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOrdersByStatus(id);
    }

    @UseGuards(JwtAuthGuard, ACGuard)
    @UseRoles({
        possession: 'own',
        action: 'read',
        resource: 'orders'
    })
    @Get('/status/:id/:userID')
    getUserOrdersByStatus(@Param('id', ParseIntPipe) id: number, @Param('userID', ParseIntPipe) userID: number) {
        return this.ordersService.findUserOrdersByStatus(id, userID);
    }

}
