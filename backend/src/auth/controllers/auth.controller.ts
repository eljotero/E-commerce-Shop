import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { AuthService } from '../services/auth.service';
import { LocalGuard } from '../guards/local.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRoles } from '../enums/user-roles';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Roles(UserRoles.Admin, UserRoles.User, UserRoles.Root)
    @Post('login')
    @UseGuards(LocalGuard)
    @UsePipes(new ValidationPipe())
    login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
        return this.authService.validateUser(loginUserDto);
    }
}
