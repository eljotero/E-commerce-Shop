import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateAdminDto {

    @IsNotEmpty({ message: 'Please Enter Full Login' })
    @IsString({ message: 'Please Enter Valid Login' })
    @Length(4, 50, {
        message: 'Login length must be between 4 and 50 characters'
    })
    userLogin: string;

    @IsNotEmpty({ message: 'Please Enter Full First Name' })
    @IsString({ message: 'Please enter Valid First Name' })
    userFirstName: string;

    @IsNotEmpty({ message: 'Please Enter Full Last Name' })
    @IsString({ message: 'Please Enter Valid Last Name' })
    userLastName: string;

    @IsNotEmpty({ message: 'Please Enter Full Password' })
    @Length(6, 50, {
        message: 'Password length must be between 6 and 50 characters'
    })
    @IsString({ message: 'Please Enter Valid Password' })
    userPassword: string;

    @IsNotEmpty({ message: 'Please Enter Full Email' })
    @IsEmail()
    userEmail: string;

    @IsNotEmpty({ message: 'Please Enter Full Phone Number' })
    @IsPhoneNumber()
    userPhone: string;
}