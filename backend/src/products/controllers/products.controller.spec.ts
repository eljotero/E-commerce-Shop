import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';
import { UpdateProductDto } from '../dtos/UpdateProduct.dto';

describe('ProductsController', () => {
  let controller: ProductsController;

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

  const mockProduct = {
    productId: 4,
    productName: 'phone',
    productDescription: 'product description',
    productPrice: 150.55,
    productWeight: 12.11,
    categoryName: 'IT'
  }

  const mockProductsService = {
    addProduct: jest.fn((dto) => {
      return {
        productId: Date.now(),
        ...dto
      }
    }),
    findAllProducts: jest.fn().mockResolvedValueOnce([mockProducts]),
    findProductById: jest.fn().mockResolvedValueOnce(mockProduct),
    findProductByName: jest.fn().mockResolvedValueOnce(mockProduct),
    updateProduct: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService]
    }).overrideProvider(ProductsService).useValue(mockProductsService).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  describe('createProduct', () => {
    it('should create product', async () => {
      const dto = {
        productName: 'mousepad',
        productDescription: 'product description',
        productPrice: 44.99,
        productWeight: 2.99,
        categoryName: 'IT'
      };
      expect(controller.createProduct(dto)).toEqual({
        productId: expect.any(Number),
        productName: 'mousepad',
        productDescription: 'product description',
        productPrice: 44.99,
        productWeight: 2.99,
        categoryName: 'IT'
      });
      expect(mockProductsService.addProduct).toHaveBeenCalled();
    })
  });

  describe('getAllProducts', () => {
    it('should get all products', async () => {
      const result = await controller.getAllProducts();
      expect(mockProductsService.findAllProducts).toHaveBeenCalled();
      expect(result).toEqual([mockProducts]);
    })
  });

  describe('getProductById', () => {
    it('should get product by id', async () => {
      const result = await controller.getProductById(mockProduct.productId);
      expect(mockProductsService.findProductById).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    })
  });

  describe('getProductByName', () => {
    it('should get product by name', async () => {
      const result = await controller.getProductByName(mockProduct.productName);
      expect(mockProductsService.findProductByName).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    })
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      const updatedProduct = { ...mockProduct, productDescription: 'updated product description' };
      const product = { updatedProductDescription: 'updated product description' };
      mockProductsService.updateProduct = jest.fn().mockResolvedValueOnce(updatedProduct);
      const result = await controller.updateProduct(product as unknown as UpdateProductDto);
      expect(mockProductsService.updateProduct).toHaveBeenCalled();
      expect(result).toEqual(updatedProduct);
    })
  })
});
