import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/CreateCategory.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRoles } from '../../auth/enums/user-roles';
import { UpdateCategoryDto } from '../dtos/UpdateCategory.dto';

@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) { }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
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

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateCategory(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.updateCategoryById(id, updateCategoryDto);
    }

    @Roles(UserRoles.Admin)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.deleteCategoryById(id);
    }

}
