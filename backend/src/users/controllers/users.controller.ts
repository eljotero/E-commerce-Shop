import { Controller, Get, Post, Body, ParseIntPipe, Param, UsePipes, ValidationPipe, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getUsers() {
        return this.userService.findUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findUserById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

}
