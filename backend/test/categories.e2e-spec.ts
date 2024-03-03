import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { EntityManager } from 'typeorm';
import { Category } from '../src/typeorm/entities/Category';

describe('CategoriesController (e2e)', () => {
    let app: INestApplication;
    let authTokenAdmin: string;
    let authTokenUser: string;
    let authTokenRoot: string;

    const categoryData = {
        categoryName: 'test1'
    };

    const categoryData2 = {
        categoryName: 1
    };

    const categoryData3 = {
        categoryName: 'food'
    };

    const categoryData4 = {
        categoryName: 'test2'
    };

    const categoryData5 = {
        categoryName: 'adsss'
    };

    const categoryData6 = {
        categoryName: 'test5'
    };

    const categoryData7 = {
        categoryName: 'test6'
    };

    const updateCategoryData = {
        newCategoryName: 'test3'
    };

    const updateCategoryData2 = {
        newCategoryName: 'test4'
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

    describe('Creating category POST /categories', () => {
        it('should create a new category', () => {
            return request(app.getHttpServer()).post('/categories').set('Authorization', `Bearer ${authTokenAdmin}`).send(categoryData).expect(HttpStatus.CREATED);
        });
        it('should create a new category', () => {
            return request(app.getHttpServer()).post('/categories').set('Authorization', `Bearer ${authTokenRoot}`).send(categoryData4).expect(HttpStatus.CREATED);
        });
        it('should not create a new category', () => {
            return request(app.getHttpServer()).post('/categories').set('Authorization', `Bearer ${authTokenUser}`).send(categoryData).expect(HttpStatus.FORBIDDEN);
        });
        it('should not create a new category', () => {
            return request(app.getHttpServer()).post('/categories').set('Authorization', `Bearer ${authTokenAdmin}`).send(categoryData2).expect(HttpStatus.BAD_REQUEST);
        });
        it('should not create a new category', () => {
            return request(app.getHttpServer()).post('/categories').set('Authorization', `Bearer ${authTokenAdmin}`).send(categoryData3).expect(HttpStatus.CONFLICT);
        });
    });

    describe('Getting categories GET /categories', () => {
        it('should return all categories', () => {
            return request(app.getHttpServer()).get('/categories').expect(HttpStatus.OK);
        });
    });

    describe('Getting category by id GET /categories/:id', () => {
        it('should return category by id', () => {
            return request(app.getHttpServer()).get('/categories/1').expect(HttpStatus.OK);
        });
        it('should not return category by id', () => {
            return request(app.getHttpServer()).get('/categories/19000').expect(HttpStatus.NOT_FOUND);
        });
    });

    describe('Getting category by name GET /categories/name/:name', () => {
        it('should return category by name', () => {
            return request(app.getHttpServer()).get(`/categories/name/${categoryData.categoryName}`).expect(HttpStatus.OK);
        });
        it('should not return category by name', () => {
            return request(app.getHttpServer()).get(`/categories/name/${categoryData5.categoryName}`).expect(HttpStatus.NOT_FOUND);
        });
    });

    describe('Updating category by id PUT /categories/:id', () => {
        it('should update category', async () => {
            const category = (await request(app.getHttpServer()).get(`/categories/name/${categoryData.categoryName}`)).body;
            const categoryID = category.categoryId;
            const res = request(app.getHttpServer()).put(`/categories/${categoryID}`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateCategoryData);
            const resBody = (await res).body;
            res.expect(HttpStatus.OK);
            expect(updateCategoryData.newCategoryName).toEqual(resBody.categoryName);
        });
        it('should update category', async () => {
            const category = (await request(app.getHttpServer()).get(`/categories/name/${categoryData4.categoryName}`)).body;
            const categoryID = category.categoryId;
            const res = request(app.getHttpServer()).put(`/categories/${categoryID}`).set('Authorization', `Bearer ${authTokenRoot}`).send(updateCategoryData2);
            const resBody = (await res).body;
            res.expect(HttpStatus.OK);
            expect(updateCategoryData2.newCategoryName).toEqual(resBody.categoryName);
        });
    });

    describe('Deleting category by id DELETE /categories/:id', () => {
        it('should delete category by id', async () => {
            await request(app.getHttpServer()).post('/categories').set('Authorization', `Bearer ${authTokenAdmin}`).send(categoryData6).expect(HttpStatus.CREATED);
            const category = (await request(app.getHttpServer()).get(`/categories/name/${categoryData6.categoryName}`).expect(HttpStatus.OK));
            const categoryId = category.body.categoryId;
            await request(app.getHttpServer()).delete(`/categories/${categoryId}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
            await request(app.getHttpServer()).get(`/categories/id/${categoryId}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should delete category by id', async () => {
            await request(app.getHttpServer()).post('/categories').set('Authorization', `Bearer ${authTokenRoot}`).send(categoryData7).expect(HttpStatus.CREATED);
            const category = (await request(app.getHttpServer()).get(`/categories/name/${categoryData7.categoryName}`).expect(HttpStatus.OK));
            const categoryId = category.body.categoryId;
            await request(app.getHttpServer()).delete(`/categories/${categoryId}`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
            await request(app.getHttpServer()).get(`/categories/id/${categoryId}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not delete category by id', async () => {
            return request(app.getHttpServer()).delete(`/categories/${1}`).set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.FORBIDDEN);
        });
        it('should not delete category by id', async () => {
            return request(app.getHttpServer()).delete(`/categories/${10}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.NOT_FOUND);
        });
    });

    async function cleanupDatabase() {
        const entityManager = app.get<EntityManager>(EntityManager);
        const category = await entityManager.findOne(Category, {
            where: {
                categoryName: updateCategoryData.newCategoryName
            }
        });
        const category2 = await entityManager.findOne(Category, {
            where: {
                categoryName: updateCategoryData2.newCategoryName
            }
        });
        if (category) {
            await entityManager.remove(Category, category);
        }
        if (category2) {
            await entityManager.remove(Category, category2)
        }
    }
});
