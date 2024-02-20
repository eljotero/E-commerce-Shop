import { IsNotEmpty, IsPostalCode, IsString } from "class-validator";

export class createUserAddressDto {
    @IsNotEmpty({ message: 'Please Enter Full ZipCode' })
    @IsPostalCode()
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