import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, Req, Get } from '@nestjs/common';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { AuthService } from '../services/auth.service';
import { LocalGuard } from '../guards/local.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalGuard)
    @UsePipes(new ValidationPipe())
    login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
        return this.authService.validateUser(loginUserDto);
    }
}
