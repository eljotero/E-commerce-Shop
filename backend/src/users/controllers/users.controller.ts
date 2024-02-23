import { Controller, Get, Post, Body, ParseIntPipe, Param, UsePipes, ValidationPipe, UseGuards, Put, SetMetadata } from '@nestjs/common';
import { ACGuard, UseRoles } from 'nest-access-control';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users.service';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { UserRoles } from 'src/auth/enums/user-roles';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Get()
    getUsers() {
        return this.userService.findUsers();
    }

    @Roles(UserRoles.Admin)
    @Roles(UserRoles.User)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findUserById(id);
    }

    @Roles(UserRoles.Admin)
    @Roles(UserRoles.User)
    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Roles(UserRoles.Admin)
    @Roles(UserRoles.User)
    @UseGuards(JwtAuthGuard)
    @Put(':login')
    @UsePipes(new ValidationPipe())
    async updateUser(@Param('login') login: string, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(login, updateUserDto);
    }

}
