import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCategoryDto {

    @IsNotEmpty({ message: 'Please Enter Valid Category Name' })
    @IsString({ message: 'Please Enter Valid Category Name' })
    newCategoryName: string;

}