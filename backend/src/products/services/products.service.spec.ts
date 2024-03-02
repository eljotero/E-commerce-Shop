import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../typeorm/entities/Product';
import { CategoriesService } from '../../categories/services/categories.service';
import { mock } from 'node:test';
import exp from 'node:constants';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProducts = [{
    productId: 1,
    productName: 'banana',
    productDescription: 'product description',
    productPrice: 59.99,
    productWeight: 65.55,
    categoryName: 'fruits'
  }, {
    productId: 2,
    productName: 'apple',
    productDescription: 'product description',
    productPrice: 89.22,
    productWeight: 22.13,
    categoryName: 'fruits'
  }, {
    productId: 3,
    productName: 'milk',
    productDescription: 'product description',
    productPrice: 22.11,
    productWeight: 23.99,
    categoryName: 'dairy'
  }];

  let mockCreateProduct = {
    productName: 'testProduct',
    productDescription: 'sesss',
    productPrice: 665.222,
    productWeight: 2123.213123,
    categoryName: 'testCategory'
  };

  let mockCreateProductRes = {
    productName: 'testProduct',
    productDescription: 'sesss',
    productPrice: 665.222,
    productWeight: 2123.213123,
    category: 'testCategory'
  };

  let mockProduct = {
    productId: 10,
    productName: 'testProduct',
    productDescription: 'sesss',
    productPrice: 665.222,
    productWeight: 2123.213123,
    categoryName: 'testCategory'
  }

  let mockProductsRepository = {
    find: jest.fn().mockResolvedValue(mockProducts),
    findOne: jest.fn()
  };

  let mockEntityManager = {
    transaction: jest.fn().mockImplementation((callback: any) => {
      return callback(mockEntityManager);
    }),
    findOne: jest.fn(),
    save: jest.fn(dto => {
      const { categoryName, ...rest } = dto;
      return {
        productId: Date.now(),
        category: dto.categoryName,
        ...rest
      }
    }),
    remove: jest.fn()
  };

  let mockCategoriesService = {
    findCategoryByName: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService,
        {
          provide: getEntityManagerToken(),
          useValue: mockEntityManager
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository
        }, CategoriesService],
    }).overrideProvider(CategoriesService).useValue(mockCategoriesService).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('addProduct', () => {
    it('should add product', async () => {
      mockCategoriesService.findCategoryByName = jest.fn().mockResolvedValueOnce(mockCreateProduct.categoryName);
      mockEntityManager.findOne = jest.fn().mockResolvedValueOnce(null);
      const result: Product = await service.addProduct(mockCreateProduct);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockCategoriesService.findCategoryByName).toHaveBeenCalledWith(mockCreateProduct.categoryName);
      expect(mockEntityManager.save).toHaveBeenCalled();
      expect(result).toEqual({ productId: expect.any(Number), ...mockCreateProductRes });
    });
  });

  describe('findAllProducts', () => {
    it('should find all products', async () => {
      const result = await service.findAllProducts();
      expect(result).toEqual(mockProducts);
      expect(mockProductsRepository.find).toHaveBeenCalled();
    });
  });

  describe('findProductByName', () => {
    it('should find product by name', async () => {
      mockProductsRepository.findOne = jest.fn().mockResolvedValueOnce(mockProducts[0]);
      const result = await service.findProductByName(mockProducts[0].productName);
      expect(mockProductsRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockProducts[0]);
    });
  });

  describe('findProductById', () => {
    it('should find product by id', async () => {
      mockProductsRepository.findOne = jest.fn().mockResolvedValueOnce(mockProducts[0]);
      const result = await service.findProductById(mockProducts[0].productId);
      expect(mockProductsRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockProducts[0]);
    });
  });

  describe('updateProductByID', () => {
    it('should update product by id', async () => {
      mockEntityManager.findOne = jest.fn().mockResolvedValueOnce(mockProduct);
      mockCategoriesService.findCategoryByName = jest.fn().mockResolvedValueOnce(mockProduct.categoryName);
      const updatedProduct = { ...mockProduct, productPrice: 1111 };
      mockEntityManager.save = jest.fn().mockResolvedValueOnce(updatedProduct);
      await service.updateProductByID(mockProduct.productId, updatedProduct);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockCategoriesService.findCategoryByName).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
    });
  });

  describe('deleteProductById', () => {
    it('should delete product', async () => {
      mockEntityManager.findOne = jest.fn().mockResolvedValueOnce(mockProduct);
      await service.deleteProductById(mockProduct.productId);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockEntityManager.remove).toHaveBeenCalled();
    });
  });
});
