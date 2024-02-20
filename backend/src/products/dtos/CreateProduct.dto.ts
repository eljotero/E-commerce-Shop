import { Type } from "class-transformer";
import { IsDecimal, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {

    @IsString({ message: 'Please Enter Valid Name' })
    productName: string;

    @IsString({ message: 'Please Enter Valid Description' })
    productDescription: string;

    @IsNumber({}, { message: 'Please Enter Valid Price' })
    @IsPositive()
    productPrice: number;

    @IsNumber({}, { message: 'Please Enter Valid Price' })
    @IsPositive()
    productWeight: number;

    @IsString({ message: 'Please Enter Valid Category Name' })
    categoryName: string;

}