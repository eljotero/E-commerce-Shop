import { IsNotEmpty, IsString, Length, IsEmail, IsPhoneNumber } from "class-validator";

export class UpdateUserDto {

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

    @IsNotEmpty({ message: 'Please Enter Full ZipCode' })
    zipCode: string;

    @IsNotEmpty({ message: 'Please Enter Full City Name' })
    @IsString({ message: 'Please Enter Valid City Name' })
    city: string;

    @IsNotEmpty({ message: 'Please Enter Full Country Name' })
    @IsString({ message: 'Please Enter Valid Country Name' })
    country: string;

    @IsNotEmpty({ message: 'Please Enter Full Adress' })
    @IsString({ message: 'Please Enter Valid Address' })
    address: string;
}