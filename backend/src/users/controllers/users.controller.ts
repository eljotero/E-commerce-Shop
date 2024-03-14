import { Controller, Get, Post, Body, ParseIntPipe, Param, UsePipes, ValidationPipe, UseGuards, Put, Request, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { UserRoles } from '../../auth/enums/user-roles';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateAdminDto } from '../dtos/CreateAdmin.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    //@Roles(UserRoles.Admin)
    //@UseGuards(JwtAuthGuard)
    @Get()
    getUsers() {
        return this.userService.findUsers();
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.Admin, UserRoles.User, UserRoles.Root)
    @Get(':id')
    getUserById(@Request() req, @Param('id', ParseIntPipe) id: number) {
        const authUser = req.user;
        if (authUser.userId !== id && (authUser.roles !== UserRoles.Admin && authUser.roles !== UserRoles.Root)) {
            throw new HttpException('You are not authorized to view this user details', HttpStatus.UNAUTHORIZED);
        }
        return this.userService.findUserById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.Root)
    @Post('/admin')
    @UsePipes(new ValidationPipe())
    async createAdmin(@Body(new ValidationPipe()) createAdminDto: CreateAdminDto) {
        return this.userService.createAdmin(createAdminDto);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRoles.Admin, UserRoles.User, UserRoles.Root)
    @Put(':login')
    @UsePipes(new ValidationPipe())
    async updateUser(@Request() req, @Param('login') login: string, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
        const authUser = req.user;
        if (authUser.userLogin !== login && (authUser.roles !== UserRoles.Admin && authUser.roles !== UserRoles.Root)) {
            throw new HttpException('You are not authorized to update this user profile', HttpStatus.UNAUTHORIZED);
        }
        return this.userService.updateUser(login, updateUserDto, req);
    }

}
