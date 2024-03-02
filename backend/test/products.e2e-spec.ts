import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Product } from '../src/typeorm/entities/Product';
import { EntityManager } from 'typeorm';


describe('ProductsController (e2e)', () => {
    let app: INestApplication;
    let authTokenAdmin: string;
    let authTokenUser: string;
    let authTokenRoot: string;

    const productData = {
        productName: 'testProduct3',
        productDescription: 'test product description',
        productPrice: 44.44,
        productWeight: 55.55,
        categoryName: 'food'
    };

    const productData2 = {
        productName: 'testProduct2',
        productDescription: 'test product description',
        productPrice: 44.44,
        productWeight: 55.55,
        categoryName: 'food'
    };

    const productData3 = {
        productName: 'testProduct5',
        productDescription: 'test product description',
        productPrice: 44.44,
        productWeight: 55.55,
        categoryName: 'test'
    }

    const productData4 = {
        productName: 'testProduct3',
        productDescription: 'test product description',
        productPrice: '44.44',
        productWeight: 55.55,
        categoryName: 'food'
    };

    const productData5 = {
        productName: 5,
        productDescription: 'test product description',
        productPrice: 44.44,
        productWeight: 55.55,
        categoryName: 'food'
    };

    const productData6 = {
        productName: 'testProduct2',
        productDescription: 555,
        productPrice: 44.44,
        productWeight: 55.55,
        categoryName: 'food'
    };

    const productData7 = {
        productName: 'testProduct2',
        productDescription: 'test product description',
        productPrice: 44.44,
        productWeight: '55.55',
        categoryName: 'food'
    };

    const productData8 = {
        productName: 'testProduct2',
        productDescription: 'test product description',
        productPrice: 44.44,
        productWeight: 55.55,
        categoryName: 5
    };

    const productData9 = {
        productName: 'testProduct5',
        productDescription: 'test product description',
        productPrice: 44.44,
        productWeight: 55.55,
        categoryName: 'food'
    };

    const productData10 = {
        productName: 'testProduct1999',
        productDescription: 'test product description',
        productPrice: 44.44,
        productWeight: 55.55,
        categoryName: 'food'
    };

    const updateProductData = {
        productName: 'testProduct8',
        productDescription: 'test productdescription',
        productPrice: 44.99,
        productWeight: 55.22,
        categoryName: 'cars'
    };

    const updateProductData2 = {
        productName: 'testProduct8',
        productDescription: 'test productdescription',
        productPrice: 44.99,
        productWeight: 55.22,
        categoryName: 'test'
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        const authResponseAdmin = await request(app.getHttpServer()).post('/auth/login').send({
            "username": "user",
            "password": "test123"
        });
        const authResponseUser = await request(app.getHttpServer()).post('/auth/login').send({
            "username": "testLogin",
            "password": "test123"
        });
        const authResponseRoot = await (request(app.getHttpServer())).post(`/auth/login`).send({
            "username": "testUser8",
            "password": "test123"
        });
        authTokenAdmin = authResponseAdmin.body.accessToken;
        authTokenUser = authResponseUser.body.accessToken;
        authTokenRoot = authResponseRoot.body.accessToken;
    });

    afterAll(async () => {
        await cleanupDatabase();
    });

    describe('Creating product POST /products', () => {
        it('should create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData).expect(HttpStatus.CREATED);
        });
        it('should create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenRoot}`).send(productData10).expect(HttpStatus.CREATED);
        });
        it('should not create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenUser}`).send(productData).expect(HttpStatus.FORBIDDEN);
        });
        it('should not create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData2).expect(HttpStatus.CONFLICT);
        });
        it('should not create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData3).expect(HttpStatus.NOT_FOUND);
        });
        it('should not create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData4).expect(HttpStatus.BAD_REQUEST);
        });
        it('should not create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData5).expect(HttpStatus.BAD_REQUEST);
        });
        it('should not create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData6).expect(HttpStatus.BAD_REQUEST);
        });
        it('should not create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData7).expect(HttpStatus.BAD_REQUEST);
        });
        it('should not create a new product', () => {
            return request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData8).expect(HttpStatus.BAD_REQUEST);
        });
    });

    describe('Getting products GET /products', () => {
        it('should get all products', () => {
            return request(app.getHttpServer()).get('/products').expect(HttpStatus.OK);
        });
    });

    describe('Getting product GET /products/:id', () => {
        it('should get product by id', () => {
            return request(app.getHttpServer()).get(`/products/${1}`).expect(HttpStatus.OK);
        });
        it('should not get product by id', () => {
            return request(app.getHttpServer()).get(`/products/${5}`).expect(HttpStatus.NOT_FOUND);
        });
    });

    describe('Getting product GET /products/name/:name', () => {
        it('should get product by name', () => {
            return request(app.getHttpServer()).get(`/products/name/${productData.productName}`).expect(HttpStatus.OK);
        });
        it('should not get product by name', () => {
            return request(app.getHttpServer()).get(`/products/name/${productData9.productName}`).expect(HttpStatus.NOT_FOUND);
        });
    });

    describe('Updating product PUT /products/:id', () => {
        it('should update product by id', async () => {
            const product = (await request(app.getHttpServer()).get(`/products/name/${productData.productName}`)).body;
            const productID = product.productId;
            const res = request(app.getHttpServer()).put(`/products/${productID}`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateProductData);
            const resBody = (await res).body;
            res.expect(HttpStatus.OK);
            expect(updateProductData.categoryName).toEqual(resBody.category.categoryName);
            expect(updateProductData.productWeight).toEqual(resBody.productWeight);
            expect(updateProductData.productPrice).toEqual(resBody.productPrice);
            expect(updateProductData.productPrice).toEqual(resBody.productPrice);
            expect(updateProductData.productDescription).toEqual(resBody.productDescription);
            expect(updateProductData.productName).toEqual(resBody.productName);
        });
        it('should update product by id', async () => {
            const product = (await request(app.getHttpServer()).get(`/products/name/${productData10.productName}`)).body;
            const productID = product.productId;
            const res = request(app.getHttpServer()).put(`/products/${productID}`).set('Authorization', `Bearer ${authTokenRoot}`).send(updateProductData);
            const resBody = (await res).body;
            res.expect(HttpStatus.OK);
            expect(updateProductData.categoryName).toEqual(resBody.category.categoryName);
            expect(updateProductData.productWeight).toEqual(resBody.productWeight);
            expect(updateProductData.productPrice).toEqual(resBody.productPrice);
            expect(updateProductData.productPrice).toEqual(resBody.productPrice);
            expect(updateProductData.productDescription).toEqual(resBody.productDescription);
            expect(updateProductData.productName).toEqual(resBody.productName);
        });
        it('should not update product by id', async () => {
            const product = (await request(app.getHttpServer()).get(`/products/name/${updateProductData.productName}`)).body;
            const productID = product.productId;
            return request(app.getHttpServer()).put(`/products/${productID}`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateProductData2).expect(HttpStatus.NOT_FOUND);
        });
        it('should not update product by id', async () => {
            return request(app.getHttpServer()).put(`/products/55555`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateProductData2).expect(HttpStatus.NOT_FOUND);
        });
    });

    describe('Deleting product DELETE /products/:id', () => {
        it('should delete product by id', async () => {
            await request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenAdmin}`).send(productData2);
            const product = (await request(app.getHttpServer()).get(`/products/name/${productData2.productName}`).expect(HttpStatus.OK));
            const productID = product.body.productId;
            request(app.getHttpServer()).delete(`/products/${productID}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
            request(app.getHttpServer()).get(`/products/name/${productData2.productName}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should delete product by id', async () => {
            await request(app.getHttpServer()).post('/products').set('Authorization', `Bearer ${authTokenRoot}`).send(productData2);
            const product = (await request(app.getHttpServer()).get(`/products/name/${productData2.productName}`).expect(HttpStatus.OK));
            const productID = product.body.productId;
            request(app.getHttpServer()).delete(`/products/${productID}`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
            request(app.getHttpServer()).get(`/products/name/${productData2.productName}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not delete product by id', () => {
            return request(app.getHttpServer()).delete(`/products/${1}`).set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.FORBIDDEN);
        });
        it('should not delete product by id', () => {
            return request(app.getHttpServer()).delete(`/products/${1500}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.NOT_FOUND);
        });
    });

    async function cleanupDatabase() {
        const entityManager = app.get<EntityManager>(EntityManager);
        const product = await entityManager.findOne(Product, {
            where: {
                productName: productData.productName
            }
        });
        const product2 = await entityManager.findOne(Product, {
            where: {
                productName: productData10.productName
            }
        });
        if (product) {
            await entityManager.remove(Product, product);
        }
        if (product2) {
            await entityManager.remove(Product, product2);
        }
    }
});
