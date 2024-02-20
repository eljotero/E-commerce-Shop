import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/CreateProduct.dto';
import { UpdateProductDto } from '../dtos/UpdateProduct.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Post()
    @UsePipes()
    createProduct(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
        return this.productsService.addProduct(createProductDto);
    }

    @Get()
    getAllProducts() {
        return this.productsService.findAllProducts();
    }

    @Get(':id')
    getProductById(@Param('id') id: number) {
        return this.productsService.findProductById(id);
    }

    @Get('/name/:name')
    getProductByName(@Param('name') name: string) {
        return this.productsService.findProductByName(name);
    }

    @Put()
    @UsePipes()
    updateProduct(@Body(new ValidationPipe()) updateProductDto: UpdateProductDto) {
        return this.productsService.updateProduct(updateProductDto);
    }
}
