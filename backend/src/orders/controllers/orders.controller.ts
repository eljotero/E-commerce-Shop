import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRoles } from '../../auth/enums/user-roles';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {
    }

    @Roles(UserRoles.Admin)
    @Get()
    getAllOrders() {
        return this.ordersService.findAllOrders()
    }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOrderById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOrderByID(id);
    }

    @Roles(UserRoles.Admin)
    @Roles(UserRoles.User)
    @UseGuards(JwtAuthGuard)
    @Get('/name/:name')
    getUserOrders(@Param('name') name: string) {
        return this.ordersService.findUserOrders(name);
    }

    @Roles(UserRoles.Admin)
    @Roles(UserRoles.User)
    @Post()
    @UseGuards(JwtAuthGuard)
    createOrder(@Body(new ValidationPipe()) createOrderDto: CreateOrderDto) {
        return this.ordersService.createNewOrder(createOrderDto);
    }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Get('/status/:id')
    getOrdersByStatus(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOrdersByStatus(id);
    }

    @Roles(UserRoles.Admin)
    @Roles(UserRoles.User)
    @UseGuards(JwtAuthGuard)
    @Get('/status/:id/:userID')
    getUserOrdersByStatus(@Param('id', ParseIntPipe) id: number, @Param('userID', ParseIntPipe) userID: number) {
        return this.ordersService.findUserOrdersByStatus(id, userID);
    }

}
