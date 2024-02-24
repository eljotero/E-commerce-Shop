import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../typeorm/entities/Category';
import { Repository, EntityManager } from 'typeorm';
import { CreateCategoryDto } from '../dtos/CreateCategory.dto';
import { UpdateCategoryDto } from '../dtos/UpdateCategory.dto';
import { CANCELLED } from 'dns';

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
            throw new HttpException('There is no category with such id', HttpStatus.NOT_FOUND);
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
            throw new HttpException('There is no category with such name', HttpStatus.NOT_FOUND);
        }
        return category;
    }

    async updateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const category: Category = await entityManager.findOne(Category, {
                where: {
                    categoryId: id
                }
            });
            if (!category) {
                throw new HttpException('There is no category with such id', HttpStatus.NOT_FOUND);
            }

            if (category.categoryName === updateCategoryDto.newCategoryName) {
                throw new HttpException('Category already has such name', HttpStatus.BAD_REQUEST);
            }
            category.categoryName = updateCategoryDto.newCategoryName;
            const updatedCategory: Category = await entityManager.save(Category, category);
            return updatedCategory;
        });
    }

    async deleteCategoryById(id: number) {
        return this.entityManager.transaction(async (entityManager) => {
            const category: Category = await entityManager.findOne(Category, {
                where: {
                    categoryId: id
                }
            });
            if (!category) {
                throw new HttpException('There is no category with such id', HttpStatus.NOT_FOUND);
            }
            await entityManager.remove(category);
        })
    }
}
