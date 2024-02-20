import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { Repository, EntityManager } from 'typeorm';
import { CreateProductDto } from '../dtos/CreateProduct.dto';
import { CategoriesService } from 'src/categories/services/categories.service';
import { Category } from 'src/typeorm/entities/Category';
import { UpdateProductDto } from '../dtos/UpdateProduct.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product) private productRepository: Repository<Product>,
        private entityManager: EntityManager, private categoriesService: CategoriesService) { }

    async addProduct(createProductDto: CreateProductDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const productName: string = createProductDto.productName;
            const categoryName: string = createProductDto.categoryName
            const product: Product = await entityManager.findOne(Product, ({
                where: {
                    productName: productName
                }
            }))
            if (product) {
                throw new HttpException('Product already exists', HttpStatus.BAD_REQUEST);
            }
            const productCategory: Category = await this.categoriesService.findCategoryByName(categoryName);
            if (!productCategory) {
                throw new HttpException('Category does not exists', HttpStatus.BAD_REQUEST);
            }
            const newProduct: Product = entityManager.create(Product, createProductDto);
            const savedProduct: Product = await entityManager.save(newProduct);
            return savedProduct;
        });
    }

    async findAllProducts() {
        return await this.productRepository.find();
    }

    async findProductByName(productName: string) {
        const product: Product = await this.productRepository.findOne({
            where: {
                productName: productName
            }
        });
        if (!product) {
            throw new HttpException('There is no such product', HttpStatus.BAD_REQUEST);
        }
        return product;
    }

    async findProductById(productID: number) {
        const product: Product = await this.productRepository.findOne({
            where: {
                productId: productID
            }
        });
        if (!product) {
            throw new HttpException('There is no such product', HttpStatus.BAD_REQUEST);
        }
        return product;
    }

    async updateProduct(updateProductDto: UpdateProductDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const productID: number = updateProductDto.productID;
            const productName: string = updateProductDto.productName;
            const categoryName: string = updateProductDto.categoryName;
            const product: Product = await entityManager.findOne(Product, ({
                where: {
                    productId: productID
                }
            }));
            if (!product) {
                throw new HttpException('There is no such product', HttpStatus.BAD_REQUEST);
            }
            const productCategory: Category = await this.categoriesService.findCategoryByName(categoryName);
            if (!productCategory) {
                throw new HttpException('Category does not exists', HttpStatus.BAD_REQUEST);
            }
            product.productName = productName;
            product.productDescription = updateProductDto.productDescription;
            product.productPrice = updateProductDto.productPrice;
            product.productWeight = updateProductDto.productWeight;
            product.category = productCategory;
            const updatedProduct: Product = await entityManager.save(product);
            return updatedProduct;
        });
    }
}
