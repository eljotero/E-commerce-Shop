import { IsNotEmpty, Length, IsString } from "class-validator";

export class LoginUserDto {

    @IsNotEmpty({ message: 'Please Enter Full Login' })
    @Length(4, 50, {
        message: 'Login length must be between 4 and 50 characters'
    })
    username: string;

    @IsNotEmpty({ message: 'Please Enter Full Password' })
    @Length(6, 50, {
        message: 'Password length must be between 6 and 50 characters'
    })
    password: string;
}