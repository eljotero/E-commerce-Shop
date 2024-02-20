import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty({ message: 'Please Enter Valid Category Name' })
    @IsString({ message: 'Please Enter Valid Category Name' })
    categoryName: string;
    
}