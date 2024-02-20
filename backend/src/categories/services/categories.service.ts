import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/typeorm/entities/Category';
import { Repository, EntityManager } from 'typeorm';
import { CreateCategoryDto } from '../dtos/CreateCategory.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
        private entityManager: EntityManager) { }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const categoryName = createCategoryDto.categoryName;
            const category: Category = await entityManager.findOne(Category, {
                where: {
                    categoryName: categoryName
                }
            });
            if (category) {
                throw new HttpException('Category already exists', HttpStatus.CONFLICT);
            }
            const newCategory = new Category();
            newCategory.categoryName = categoryName;
            await this.entityManager.insert(Category, newCategory);
            return newCategory;
        });
    }

    async findAllCategories() {
        return await this.categoryRepository.find();
    }

    async findCategoryById(id: number) {
        const category: Category = await this.categoryRepository.findOne({
            where: {
                categoryId: id
            }
        });
        if (!category) {
            throw new HttpException('There is no category with such id', HttpStatus.BAD_REQUEST);
        }
        return category;
    }

    async findCategoryByName(name: string) {
        const category: Category = await this.categoryRepository.findOne({
            where: {
                categoryName: name
            }
        });
        if (!category) {
            throw new HttpException('There is no category with such name', HttpStatus.BAD_REQUEST);
        }
        return category;
    }
}
