import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { number } from 'zod';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let authTokenAdmin: string;
  let authTokenUser: string;
  let authTokenRoot: string;
  let userId1: number;
  let userId2: number;
  let userId3: number;
  let userLogin1: string;
  let userLogin2: string;

  const createUserDto = {
    userLogin: "testsUser",
    userFirstName: "John",
    userLastName: "Doe",
    userPassword: "example_password",
    userEmail: "example@example.com",
    userPhone: "+48953421309",
    zipCode: "12345",
    city: "Example City",
    country: "Example Country",
    address: "123 Example Street"
  };
  const createUserDto2 = {
    userLogin: 2323,
    userFirstName: "John",
    userLastName: "Doe",
    userPassword: "example_password",
    userEmail: "example@example.com",
    userPhone: "+48953421309",
    zipCode: "12345",
    city: "Example City",
    country: "Example Country",
    address: "123 Example Street"
  };
  const createUserDto3 = {
    userLogin: "testsUser",
    userFirstName: "John",
    userLastName: 2222,
    userPassword: "example_password",
    userEmail: "example@example.com",
    userPhone: "+48953421309",
    zipCode: "12345",
    city: "Example City",
    country: "Example Country",
    address: "123 Example Street"
  };
  const createAdminDto = {
    userLogin: "testsAdmin",
    userFirstName: "Logan",
    userLastName: "Paul",
    userPassword: "example_pass6789",
    userEmail: "logan@mail.com",
    userPhone: "+48657890542",
  };
  const createAdminDto2 = {
    userLogin: "testsAdmin2",
    userFirstName: "Logan2",
    userLastName: "Paul2",
    userPassword: "example_pass689",
    userEmail: "logan4@mail.com",
    userPhone: "+48659890542",
  };
  const updateUserDto = {
    userFirstName: "JohnT",
    userLastName: "DoeT",
    userPassword: "example_passwordT",
    userEmail: "exampleT@example.com",
    userPhone: "+48765890234",
    zipCode: "12342",
    city: "Example Cit",
    country: "Example Countr",
    address: "123 Example Stree"
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

  describe('Getting users GET /users', () => {
    it('should return all users', () => {
      return request(app.getHttpServer()).get('/users').set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
    });
    it('should return all users', () => {
      return request(app.getHttpServer()).get('/users').set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
    });
    it('should not return all users', () => {
      return request(app.getHttpServer()).get('/users').set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('Getting user by id GET /users/:id', () => {
    it('should get user by id', () => {
      return request(app.getHttpServer()).get('/users/1').set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
    });
    it('should get user by id', () => {
      return request(app.getHttpServer()).get('/users/1').set('Authorization', `Bearer ${authTokenRoot}`).expect(HttpStatus.OK);
    });
    it('should get user by id', () => {
      return request(app.getHttpServer()).get('/users/1').set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.OK);
    });
    it('should not get user by id', () => {
      return request(app.getHttpServer()).get('/users/5').set('Authorization', `Bearer ${authTokenUser}`).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Creating user POST /users', () => {
    it('should create new user', async () => {
      const resp = (await request(app.getHttpServer()).post('/users').send(createUserDto).expect(HttpStatus.CREATED));
      const respBody = resp.body;
      userId1 = respBody.userId;
      userLogin1 = respBody.userLogin;
      const resp2 = (await request(app.getHttpServer()).get(`/users/${userId1}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK));
      const resp2Body = resp2.body;
      expect(respBody.userLogin).toEqual(resp2Body.userLogin);
      expect(respBody.userFirstName).toEqual(resp2Body.userFirstName);
      expect(respBody.userLastName).toEqual(resp2Body.userLastName);
      expect(respBody.userEmail).toEqual(resp2Body.userEmail);
      expect(respBody.userPhone).toEqual(resp2Body.userPhone);
      expect(respBody.addresses).toEqual(resp2Body.addresses);
    });
    it('should not create new user', async () => {
      return request(app.getHttpServer()).post('/users').send(createUserDto2).expect(HttpStatus.BAD_REQUEST);
    });
    it('should not create new user', async () => {
      return request(app.getHttpServer()).post('/users').send(createUserDto3).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Creating admin POST /users/admin', () => {
    it('should create admin', async () => {
      const res = await request(app.getHttpServer()).post('/users/admin').set('Authorization', `Bearer ${authTokenRoot}`).send(createAdminDto).expect(HttpStatus.CREATED);
      userId2 = res.body.userId;
      userLogin2 = res.body.userLogin;
    });
    it('should not create admin', async () => {
      return request(app.getHttpServer()).post('/users/admin').set('Authorization', `Bearer ${authTokenAdmin}`).send(createAdminDto2).expect(HttpStatus.FORBIDDEN);
    });
    it('should not create admin', async () => {
      return request(app.getHttpServer()).post('/users/admin').set('Authorization', `Bearer ${authTokenUser}`).send(createAdminDto2).expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('Updating user PUT /users/:login', () => {
    it('should update user profile', async () => {
      (await request(app.getHttpServer()).put(`/users/${userLogin1}`).set('Authorization', `Bearer ${authTokenAdmin}`).send(updateUserDto).expect(HttpStatus.OK));
      const afterUpdate = await request(app.getHttpServer()).get(`/users/${userId1}`).set('Authorization', `Bearer ${authTokenAdmin}`).expect(HttpStatus.OK);
      expect(afterUpdate.body.userFirstName).toEqual(updateUserDto.userFirstName);
      expect(afterUpdate.body.userLastName).toEqual(updateUserDto.userLastName);
      expect(afterUpdate.body.userEmail).toEqual(updateUserDto.userEmail);
      expect(afterUpdate.body.userPhone).toEqual(updateUserDto.userPhone);
    });
    it('should not update admin profile', async () => {
      return request(app.getHttpServer()).put(`/users/${userLogin2}`).set('Authorization', `Bearer ${authTokenUser}`).send(updateUserDto).expect(HttpStatus.UNAUTHORIZED);
    });
    it('should not update user profile', () => {
      return request(app.getHttpServer()).put(`/users/${userLogin1}`).set('Authorization', `Bearer ${authTokenUser}`).send(updateUserDto).expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
