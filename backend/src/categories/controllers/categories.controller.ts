import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/CreateCategory.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRoles } from '../../auth/enums/user-roles';
import { UpdateCategoryDto } from '../dtos/UpdateCategory.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) { }

    //@Roles(UserRoles.Admin)
    //@UseGuards(JwtAuthGuard)
    @UsePipes()
    @Post()
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.Admin, UserRoles.Root)
    @Put(':id')
    updateCategory(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.updateCategoryById(id, updateCategoryDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.Admin, UserRoles.Root)
    @Delete(':id')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.deleteCategoryById(id);
    }

}
