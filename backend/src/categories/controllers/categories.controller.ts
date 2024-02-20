import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/CreateCategory.dto';

@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) { }

    @Post()
    @UsePipes()
    createCategory(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.createCategory(createCategoryDto);
    }

    @Get()
    getAllCategories() {
        return this.categoriesService.findAllCategories();
    }

    @Get(':id')
    getCategoryById(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findCategoryById(id);
    }

    @Get('/name/:name')
    getCategoryByName(@Param('name') name: string) {
        return this.categoriesService.findCategoryByName(name);
    }

}
