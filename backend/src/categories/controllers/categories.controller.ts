import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/CreateCategory.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/auth/enums/user-roles';

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

}
