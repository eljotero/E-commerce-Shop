import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { EntityManager } from 'typeorm';

describe('OrdersController (e2e)', () => {
    let app: INestApplication;
    let authTokenAdmin: string;
    let authTokenUser: string;
    let authTokenRoot: string;
    let order1ID: number;
    let order2ID: number;

    const createOrderData = {
        username: 'user',
        orderStatus: 3,
        orderedProducts: [
            {
                "productId": 1,
                "quantity": 2
            },
            {
                "productId": 2,
                "quantity": 1
            }
        ]
    };

    const createOrderData2 = {
        username: 'testUser8',
        orderStatus: 3,
        orderedProducts: [
            {
                "productId": 2,
                "quantity": 2
            },
            {
                "productId": 1,
                "quantity": 1
            }
        ]
    };

    const createOrderData3 = {
        username: 'testLogin9',
        orderStatus: 1,
        orderedProducts: [
            {
                "productId": 100,
                "quantity": 2
            },
            {
                "productId": 1,
                "quantity": 1
            }
        ]
    };

    const userLogin = 'testLogin';

    const userLogin2 = 'testLogin4';

    const updateOrderDto = {
        orderStatus: 2,
        orderedProducts: [
            {
                "productId": 1,
                "quantity": 10
            },
            {
                "productId": 2,
                "quantity": 15
            }
        ]
    };

    const updateOrderDto2 = {
        orderStatus: 2,
        orderedProducts: [
            {
                "productId": 2,
                "quantity": 5
            },
            {
                "productId": 1,
                "quantity": 7
            }
        ]
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


    describe('Getting all orders GET /orders', () => {
        it('should return all orders', () => {
            return request(app.getHttpServer()).get('/orders').set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
        });
        it('should return all orders', () => {
            return request(app.getHttpServer()).get('/orders').set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
        });
        it('should not return all orders', () => {
            return request(app.getHttpServer()).get('/orders').set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.FORBIDDEN);
        });
    });

    describe('Getting order by id GET /orders/id', () => {
        it('should return order by id', () => {
            return request(app.getHttpServer()).get(`/orders/${10}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
        });
        it('should return order by id', () => {
            return request(app.getHttpServer()).get(`/orders/${10}`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
        });
        it('should not return order by id', () => {
            return request(app.getHttpServer()).get(`/orders/${1000}`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not return order by id', () => {
            return request(app.getHttpServer()).get(`/orders/${1000}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not return order by id', () => {
            return request(app.getHttpServer()).get(`/orders/${10}`).set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.FORBIDDEN);
        });
    });

    describe('Getting user orders GET /orders/name/:name', () => {
        it('should return user orders', () => {
            return request(app.getHttpServer()).get(`/orders/name/${userLogin}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
        });
        it('should return user orders', () => {
            return request(app.getHttpServer()).get(`/orders/name/${userLogin}?orderStatusID=1`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
        });
        it('should return user orders', () => {
            return request(app.getHttpServer()).get(`/orders/name/${userLogin}`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
        });
        it('should return user orders', () => {
            return request(app.getHttpServer()).get(`/orders/name/${userLogin}?orderStatusID=2`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
        });
        it('should return user orders', () => {
            return request(app.getHttpServer()).get(`/orders/name/${userLogin}orderStatusID=2`).set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.UNAUTHORIZED);
        });
        it('should return user orders', () => {
            return request(app.getHttpServer()).get(`/orders/name/${userLogin}`).set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.OK);
        });
        it('should not return user orders', () => {
            return request(app.getHttpServer()).get(`/orders/name/${userLogin2}`).set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.UNAUTHORIZED);
        });

    });

    describe('Creating order by id POST /orders', () => {
        it('should create order', async () => {
            const response = await request(app.getHttpServer()).post('/orders').set('Authorization', `Bearer ${authTokenAdmin}`).send(createOrderData).expect(HttpStatus.CREATED);
            order1ID = response.body.orderId;
        });
        it('should create order', async () => {
            const response = await request(app.getHttpServer()).post('/orders').set('Authorization', `Bearer ${authTokenRoot}`).send(createOrderData2).expect(HttpStatus.CREATED);
            order2ID = response.body.orderId;
        });
        it('should not create order', () => {
            return request(app.getHttpServer()).post('/orders').set('Authorization', `Bearer ${authTokenUser}`).send(createOrderData3).expect(HttpStatus.UNAUTHORIZED);
        });
        it('should not create order', () => {
            createOrderData3.username = 'testLogin';
            return request(app.getHttpServer()).post('/orders').set('Authorization', `Bearer ${authTokenUser}`).send(createOrderData3).expect(HttpStatus.NOT_FOUND);
        });

    });


    describe('Getting orders by status GET /orders/status/:id', () => {
        it('should return orders by status', () => {
            return request(app.getHttpServer()).get('/orders/status/1').set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
        });
        it('should return orders by status', () => {
            return request(app.getHttpServer()).get('/orders/status/2').set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
        });
        it('should not return orders by status', () => {
            return request(app.getHttpServer()).get('/orders/status/2').set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.FORBIDDEN);
        });
        it('should not return orders by status', () => {
            return request(app.getHttpServer()).get('/orders/status/100').set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not return orders by status', () => {
            return request(app.getHttpServer()).get('/orders/status/100').set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.NOT_FOUND);
        });
    });

    describe('Updating orders PUT /orders/:id', () => {
        it('should update order', async () => {
            const beforeUpdate = (await request(app.getHttpServer()).get(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`)).body;
            const res = request(app.getHttpServer()).put(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateOrderDto);
            res.expect(HttpStatus.OK);
            const resBody = (await res).body;
            expect(resBody.orderStatus).not.toEqual(beforeUpdate.orderStatus);
            expect(resBody.totalPrice).not.toEqual(beforeUpdate.totalPrice);
            expect(resBody.totalWeight).not.toEqual(beforeUpdate.totalWeight);
            expect(resBody.orderId).toEqual(beforeUpdate.orderId);
            expect(resBody.orderDate).toEqual(beforeUpdate.orderDate);
        });
        it('should update order', async () => {
            const beforeUpdate = (await request(app.getHttpServer()).get(`/orders/${order2ID}`).set('Authorization', `Bearer ${authTokenRoot}`)).body;
            const res = request(app.getHttpServer()).put(`/orders/${order2ID}`).set('Authorization', `Bearer ${authTokenRoot}`).send(updateOrderDto2);
            res.expect(HttpStatus.OK);
            const resBody = (await res).body;
            expect(resBody.orderStatus).not.toEqual(beforeUpdate.orderStatus);
            expect(resBody.totalPrice).not.toEqual(beforeUpdate.totalPrice);
            expect(resBody.totalWeight).not.toEqual(beforeUpdate.totalWeight);
            expect(resBody.orderId).toEqual(beforeUpdate.orderId);
            expect(resBody.orderDate).toEqual(beforeUpdate.orderDate);
        });
        it('should not update order', async () => {
            updateOrderDto.orderStatus = 100;
            return request(app.getHttpServer()).put(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateOrderDto).expect(HttpStatus.BAD_REQUEST);
        });
        it('should not update order', async () => {
            updateOrderDto.orderStatus = 3;
            updateOrderDto.orderedProducts[0].productId = 100;
            return request(app.getHttpServer()).put(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateOrderDto).expect(HttpStatus.NOT_FOUND);
        });
        it('should not update order', async () => {
            updateOrderDto.orderedProducts[0].productId = 1;
            return request(app.getHttpServer()).put(`/orders/222222`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateOrderDto).expect(HttpStatus.NOT_FOUND);
        });
        it('should not update order', async () => {
            return request(app.getHttpServer()).put(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenUser}`).send(updateOrderDto).expect(HttpStatus.FORBIDDEN);
        });
    });

    describe('Updating orders status PUT /orders/:id/change-status/:statusId', () => {
        it('should update order status', async () => {
            const beforeUpdate = (await request(app.getHttpServer()).get(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`)).body;
            const res = request(app.getHttpServer()).put(`/orders/${order1ID}/change-status/3`).set('Authorization', `Bearer ${authTokenAdmin}`);
            res.expect(HttpStatus.OK);
            const afterUpdate = (await request(app.getHttpServer()).get(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`)).body;
            expect(beforeUpdate.orderStatus.orderStatusId).toEqual(afterUpdate.orderStatus.orderStatusId);
        });
        it('should update order status', async () => {
            const beforeUpdate = (await request(app.getHttpServer()).get(`/orders/${order2ID}`).set('Authorization', `Bearer ${authTokenRoot}`)).body;
            const res = request(app.getHttpServer()).put(`/orders/${order2ID}/change-status/3`).set('Authorization', `Bearer ${authTokenRoot}`);
            res.expect(HttpStatus.OK);
            const afterUpdate = (await request(app.getHttpServer()).get(`/orders/${order2ID}`).set('Authorization', `Bearer ${authTokenRoot}`)).body;
            expect(beforeUpdate.orderStatus.orderStatusId).toEqual(afterUpdate.orderStatus.orderStatusId);
        });
        it('should not update order status', async () => {
            return request(app.getHttpServer()).put(`/orders/${order2ID}/change-status/3`).set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.FORBIDDEN);
        });
        it('should not update order status', async () => {
            return request(app.getHttpServer()).put(`/orders/${order2ID}/change-status/0`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not update order status', async () => {
            return request(app.getHttpServer()).put(`/orders/${order1ID}/change-status/0`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not update order status', async () => {
            return request(app.getHttpServer()).put(`/orders/${order1ID}/change-status/4`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.BAD_REQUEST);
        });
        it('should not update order status', async () => {
            return request(app.getHttpServer()).put(`/orders/${order2ID}/change-status/4`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.BAD_REQUEST);
        });
        it('should not update order status', async () => {
            return request(app.getHttpServer()).put(`/orders/1999/change-status/3`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not update order status', async () => {
            return request(app.getHttpServer()).put(`/orders/2555/change-status/3`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.NOT_FOUND);
        });
    });

    describe('Deleting orders DELETE /orders/:id', () => {
        it('should delete order', async () => {
            await request(app.getHttpServer()).delete(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
            return request(app.getHttpServer()).get(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should delete order', async () => {
            await request(app.getHttpServer()).delete(`/orders/${order2ID}`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
            return request(app.getHttpServer()).get(`/orders/${order2ID}`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not delete order', () => {
            return request(app.getHttpServer()).get(`/orders/${order2ID}`).set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.FORBIDDEN);
        });
        it('should not delete order', () => {
            return request(app.getHttpServer()).get(`/orders/${order1ID}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.NOT_FOUND);
        });
        it('should not delete order', () => {
            return request(app.getHttpServer()).get(`/orders/${order2ID}`).set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.NOT_FOUND);
        });
    });
    // describe('Deleting order by id DELETE /orders', () => {
    //     it('should delete order', () => {
    //         return request(app.getHttpServer()).delete(`/orders/${}`).set('Authorization', `Bearer ${authTokenAdmin}`).send(createOrderData).expect(HttpStatus.CREATED);
    //     });
    // });
    async function cleanupDatabase() {
        const entityManager = app.get<EntityManager>(EntityManager);
    }
});
