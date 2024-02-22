import { Controller, Get, Post, Body, ParseIntPipe, Param, UsePipes, ValidationPipe, HttpStatus, HttpException, UseGuards, Put } from '@nestjs/common';
import { ACGuard, UseRoles } from 'nest-access-control';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users.service';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @UseGuards(JwtAuthGuard, ACGuard)
    @UseRoles({
        possession: 'any',
        action: 'read',
        resource: 'users'
    })

    @Get()
    getUsers() {
        return this.userService.findUsers();
    }

    @UseGuards(JwtAuthGuard, ACGuard)
    @UseRoles({
        possession: 'own',
        action: 'read',
        resource: 'users'
    })

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findUserById(id);
    }

    @UseGuards(ACGuard)
    @UseRoles({
        possession: 'own',
        action: 'create',
        resource: 'users'
    })
    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @UseGuards(ACGuard, JwtAuthGuard)
    @UseRoles({
        possession: 'own',
        action: 'update',
        resource: 'users'
    })
    @Put(':login')
    @UsePipes(new ValidationPipe())
    async updateUser(@Param('login') login: string, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(login, updateUserDto);
    }

}
