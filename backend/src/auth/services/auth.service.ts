import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {
    }

    async validateUser(loginUserDto: LoginUserDto) {
        const userName = loginUserDto.username;
        const userPass = loginUserDto.password;
        const user = await this.usersService.findUser(userName);
        if (user && (await bcrypt.compare(userPass, user.userPassword))) {
            const { userId, roles } = user;
            const newUser = { userName, userId, roles };
            return {
                accessToken: this.jwtService.sign(newUser)
            };
        }
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
}
