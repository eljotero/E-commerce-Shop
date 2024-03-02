import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../../typeorm/entities/Category';
import { UpdateCategoryDto } from '../dtos/UpdateCategory.dto';

describe('CategoriesService', () => {
    let service: CategoriesService;

    let mockCategory = {
        categoryName: 'testCategory'
    };

    const mockCategories = [{
        categoryId: 1,
        categoryName: 'test'
    }, {
        categoryId: 2,
        categoryName: 'test2'
    }];

    let mockCategory2 = {
        categoryId: 3,
        categoryName: 'test3'
    }

    let mockCategoriesRepository = {
        find: jest.fn().mockResolvedValueOnce(mockCategories),
        findOne: jest.fn().mockResolvedValue(mockCategory2)
    };

    let mockEntityManager = {
        transaction: jest.fn().mockImplementation((callback: any) => {
            return callback(mockEntityManager);
        }),
        insert: jest.fn(dto => {
            return {
                categoryId: Date.now(),
                ...dto
            }
        }),
        remove: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoriesService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockCategoriesRepository
                },
                {
                    provide: getEntityManagerToken(),
                    useValue: mockEntityManager

                }]
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
    });

    describe('createCategory', () => {
        it('should create category', async () => {
            const result = await service.createCategory(mockCategory);
            expect(mockEntityManager.transaction).toHaveBeenCalled();
            expect(mockEntityManager.findOne).toHaveBeenCalled();
            expect(mockEntityManager.insert).toHaveBeenCalled();
            expect(result).toEqual(mockCategory);
        })
    });

    describe('findAllCategories', () => {
        it('should find all categories', async () => {
            const result = await service.findAllCategories();
            expect(mockCategoriesRepository.find).toHaveBeenCalled();
            expect(result).toEqual(mockCategories);
        })
    });

    describe('findCategoryById', () => {
        it('should find category by id', async () => {
            const result = await service.findCategoryById(mockCategory2.categoryId);
            expect(mockCategoriesRepository.findOne).toHaveBeenCalled();
            expect(result).toEqual(mockCategory2);
        })
    });

    describe('findCategoryByName', () => {
        it('should find category by name', async () => {
            const result = await service.findCategoryByName(mockCategory2.categoryName);
            expect(mockCategoriesRepository.findOne).toHaveBeenCalled();
            expect(result).toEqual(mockCategory2);
        })
    });

    describe('updateCategoryById', () => {
        it('should update category', async () => {
            mockEntityManager.findOne = jest.fn().mockResolvedValue(mockCategory2);
            const updatedCategory = { ...mockCategory2, categoryName: 'newName' };
            const category = { newCategoryName: 'newName' };
            mockEntityManager.save = jest.fn().mockResolvedValueOnce(updatedCategory);
            const result = await service.updateCategoryById(mockCategory2.categoryId, category as UpdateCategoryDto);
            expect(mockEntityManager.transaction).toHaveBeenCalled();
            expect(mockEntityManager.findOne).toHaveBeenCalled();
            expect(result).toEqual(updatedCategory);
        })
    });

    describe('deleteCategoryById', () => {
        it('should delete category by id', async () => {
            mockEntityManager.findOne = jest.fn().mockResolvedValue(mockCategory2);
            mockEntityManager.remove = jest.fn().mockResolvedValueOnce({
                status: 'done'
            });
            await service.deleteCategoryById(mockCategory2.categoryId);
            expect(mockEntityManager.transaction).toHaveBeenCalled();
            expect(mockEntityManager.remove).toHaveBeenCalled();
            expect(mockEntityManager.remove).toHaveBeenCalledWith(mockCategory2);
        })
    });

});
