import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards, ValidationPipe, Request, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRoles } from '../../auth/enums/user-roles';
import { UpdateOrderDto } from '../dtos/UpdateOrder.dto';


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
    getUserOrders(@Request() req, @Param('name') name: string) {
        const authUser = req.user;
        if (authUser.userName !== name && authUser.roles !== UserRoles.Admin) {
            throw new HttpException('You are not authorized to view orders for this user', HttpStatus.UNAUTHORIZED);
        }
        return this.ordersService.findUserOrders(name);
    }

    @Roles(UserRoles.Admin)
    @Roles(UserRoles.User)
    @UseGuards(JwtAuthGuard)
    @Post()
    createOrder(@Request() req, @Body(new ValidationPipe()) createOrderDto: CreateOrderDto) {
        const authUser = req.user;
        if (authUser.userName !== createOrderDto.username && authUser.roles !== UserRoles.Admin) {
            throw new HttpException('You are not authorized to create order for such user', HttpStatus.UNAUTHORIZED);
        }
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
    getUserOrdersByStatus(@Request() req, @Param('id', ParseIntPipe) id: number, @Param('userID', ParseIntPipe) userID: number) {
        const authUser = req.user;
        if (authUser.userID !== userID && authUser.roles !== UserRoles.Admin) {
            throw new HttpException('You are not authorized to view orders for this user', HttpStatus.UNAUTHORIZED);
        }
        return this.ordersService.findUserOrdersByStatus(id, userID);
    }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateOrder(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateOrderDto: UpdateOrderDto) {
        return this.ordersService.updateOrderById(id, updateOrderDto);
    }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Put(':id/change-status/:statusId')
    updateOrderStatus(@Param('id') id: number, @Param('statusId') statusId: number) {
        return this.ordersService.changeOrderStatus(id, statusId);
    }

}
