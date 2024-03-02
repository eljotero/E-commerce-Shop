import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../services/categories.service';
import { UpdateCategoryDto } from '../dtos/UpdateCategory.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;


  const mockCategories = [{
    categoryId: 1,
    categoryName: 'test'
  }, {
    categoryId: 2,
    categoryName: 'test2'
  }];

  const mockCategory = {
    categoryId: 3,
    categoryName: 'test3'
  }

  const mockCategoriesService = {
    createCategory: jest.fn(dto => {
      return {
        id: Date.now(),
        ...dto
      }
    }),
    findAllCategories: jest.fn().mockResolvedValueOnce([mockCategories]),
    findCategoryById: jest.fn().mockResolvedValueOnce(mockCategory),
    findCategoryByName: jest.fn().mockResolvedValueOnce(mockCategory),
    updateCategoryById: jest.fn(),
    deleteCategoryById: jest.fn().mockResolvedValueOnce({ status: 'done' })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService]
    }).overrideProvider(CategoriesService).useValue(mockCategoriesService).compile();
    controller = module.get<CategoriesController>(CategoriesController);
  });

  describe('createCategory', () => {
    const dto = { categoryName: 'testCategory' };
    it('should create category', () => {
      expect(controller.createCategory(dto)).toEqual({
        id: expect.any(Number),
        categoryName: 'testCategory'
      })
      expect(mockCategoriesService.createCategory).toHaveBeenCalledWith(dto);
    })
  });

  describe('getAllCategories', () => {
    it('should get all categories', async () => {
      const result = await controller.getAllCategories();
      expect(mockCategoriesService.findAllCategories).toHaveBeenCalled();
      expect(result).toEqual([mockCategories]);
    })
  });

  describe('getCategoryById', () => {
    it('should get category by id', async () => {
      const result = await controller.getCategoryById(mockCategory.categoryId);
      expect(mockCategoriesService.findCategoryById).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    })
  });

  describe('getCategoryByName', () => {
    it('should get category by name', async () => {
      const result = await controller.getCategoryByName(mockCategory.categoryName);
      expect(mockCategoriesService.findCategoryByName).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    })
  });

  describe('updateCategory', () => {
    it('should update category', async () => {
      const updatedCategory = { ...mockCategory, categoryName: 'new category name' };
      const category = { newCategoryName: 'new category name' };
      mockCategoriesService.updateCategoryById = jest.fn().mockResolvedValueOnce(updatedCategory);
      const result = await controller.updateCategory(mockCategory.categoryId, category as UpdateCategoryDto);
      expect(mockCategoriesService.updateCategoryById).toHaveBeenCalled();
      expect(result).toEqual(updatedCategory);
    })
  });

  describe('deleteCategory', () => {
    it('should delete category', async () => {
      const result = await controller.deleteCategory(mockCategory.categoryId);
      expect(mockCategoriesService.deleteCategoryById).toHaveBeenCalled();
      expect(result).toEqual({ status: 'done' });
    })
  });

});
