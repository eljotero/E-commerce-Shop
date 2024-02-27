import { Type } from 'class-transformer';
import { Length, IsNotEmpty, IsNumber, Max, Min, IsInt, IsPositive, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';

class OrderedProductDto {
    @IsInt({ message: 'Please Enter Valid Product ID' })
    @IsPositive({ message: 'Please Enter Valid Product ID' })
    productId: number;

    @IsInt({ message: 'Please Enter Valid Quantity' })
    @IsPositive({ message: 'Please Enter Valid Quantity' })
    quantity: number;
}


export class UpdateOrderDto {


    @IsNotEmpty({ message: 'Please Enter Valid Order Status' })
    @IsNumber({}, { message: 'Please Enter Valid Order Status' })
    @Min(1)
    @Max(4)
    orderStatus: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderedProductDto)
    orderedProducts: OrderedProductDto[];
}