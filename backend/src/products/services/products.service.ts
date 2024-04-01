import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../typeorm/entities/Product';
import { Repository, EntityManager } from 'typeorm';
import { CreateProductDto } from '../dtos/CreateProduct.dto';
import { CategoriesService } from '../../categories/services/categories.service';
import { Category } from '../../typeorm/entities/Category';
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
                throw new HttpException('Product already exists', HttpStatus.CONFLICT);
            }
            const productCategory: Category = await entityManager.findOne(Category, ({
                where: {
                    categoryName: categoryName
                }
            }));
            if (!productCategory) {
                throw new HttpException('There is no category with such name', HttpStatus.NOT_FOUND);
            }
            const newProduct = new Product();
            newProduct.category = productCategory;
            newProduct.productDescription = createProductDto.productDescription;
            newProduct.productName = createProductDto.productName;
            newProduct.productPrice = createProductDto.productPrice;
            newProduct.productWeight = createProductDto.productWeight;
            await entityManager.save(newProduct);
            return await entityManager.findOne(Product, ({
                where: {
                    productName: productName
                },
                select: {
                    category: {
                        categoryName: true
                    }
                },
                relations: {
                    category: true
                }
            }));
        });
    }

    async findAllProducts() {
        return await this.productRepository.find(
            {
                select: {
                    category: {
                        categoryName: true,
                        categoryId: true
                    }
                },
                relations: {
                    category: true
                }
            });
    }

    async findProductByName(productName: string) {
        const product: Product = await this.productRepository.findOne({
            where: {
                productName: productName
            }, select: {
                category: {
                    categoryName: true
                }
            },
            relations: {
                category: true
            }
        });
        if (!product) {
            throw new HttpException('There is no such product', HttpStatus.NOT_FOUND);
        }
        return product;
    }

    async findProductById(productID: number) {
        const product: Product = await this.productRepository.findOne({
            where: {
                productId: productID
            },
            select: {
                category: {
                    categoryId: true,
                    categoryName: true
                }
            },
            relations: {
                category: true
            }
        });
        if (!product) {
            throw new HttpException('There is no such product', HttpStatus.NOT_FOUND);
        }
        return product;
    }

    async findProductsByCategory(categoryId: number) {
        const products: Product[] = await this.productRepository.find({
            where: {
                category: {
                    categoryId: categoryId
                }
            },
            select: {
                category: {
                    categoryId: true,
                    categoryName: true
                }
            },
            relations: {
                category: true
            }
        });
        return products;
    }

    async updateProductByID(updateProductDto: UpdateProductDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const productName: string = updateProductDto.productName;
            const categoryName: string = updateProductDto.categoryName;
            const product: Product = await entityManager.findOne(Product, ({
                where: {
                    productId: updateProductDto.productId
                }
            }));
            if (!product) {
                throw new HttpException('There is no such product', HttpStatus.NOT_FOUND);
            }
            const productCategory: Category = await entityManager.findOne(Category, ({
                where: {
                    categoryName: categoryName
                }
            }));
            if (!productCategory) {
                throw new HttpException('Category does not exists', HttpStatus.NOT_FOUND);
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

    async deleteProductById(id: number) {
        return this.entityManager.transaction(async (entityManager) => {
            const product: Product = await entityManager.findOne(Product, {
                where: {
                    productId: id
                }
            });
            if (!product) {
                throw new HttpException('There is no such product', HttpStatus.NOT_FOUND);
            }
            await entityManager.remove(Product, product);
        });
    }
}
