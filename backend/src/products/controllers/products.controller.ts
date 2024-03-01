import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe, Delete } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/CreateProduct.dto';
import { UpdateProductDto } from '../dtos/UpdateProduct.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRoles } from '../../auth/enums/user-roles';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
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

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @UsePipes()
    updateProduct(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateProductDto: UpdateProductDto) {
        return this.productsService.updateProductByID(id, updateProductDto);
    }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.deleteProductById(id);
    }
}
