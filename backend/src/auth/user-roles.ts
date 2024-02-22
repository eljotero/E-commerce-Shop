import { RolesBuilder } from "nest-access-control";

export enum UserRoles {
    Admin = 'Admin',
    User = 'User'
}

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(UserRoles.User).readAny('products', 'categories').readOwn('users', 'orders').createOwn('orders', 'users').updateOwn('users', 'orders')

roles.grant(UserRoles.Admin).readAny('orders', 'categories').readAny('products', 'users').deleteAny('categories', 'orders').deleteAny('products', 'users').updateAny('categories', 'orders').updateAny('products', 'users').createAny('categories', 'orders').createAny('products', 'users').readOwn('orders')