import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../typeorm/entities/Order';
import { UsersService } from '../../users/services/users.service';
import { Repository, EntityManager } from 'typeorm';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { OrdersstatusesService } from '../../ordersstatuses/services/ordersstatuses.service';
import { User } from '../../typeorm/entities/User';
import { OrderStatus } from '../../typeorm/entities/OrderStatus';
import { OrderedProduct } from '../../typeorm/entities/OrderedProduct';
import { Product } from '../../typeorm/entities/Product';
import { ProductsService } from '../../products/services/products.service';
import { UpdateOrderDto } from '../dtos/UpdateOrder.dto';

@Injectable()
export class OrdersService {
    constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>, private entityManager: EntityManager, private usersService: UsersService, private ordersStatusesService: OrdersstatusesService, private productsService: ProductsService) {
    }

    async findAllOrders() {
        return await this.ordersRepository.find({
            select: {
                orderedProducts: {
                    quantity: true,
                    product: {
                        productId: true,
                        productName: true,
                        productPrice: true,
                        productWeight: true,
                        productDescription: true
                    }
                },
                user: {
                    userFirstName: true,
                    userLastName: true,
                    userPhone: true
                }
            },
            relations: {
                orderedProducts: {
                    product: true
                },
                user: true
            }
        });
    }

    async findOrderByID(orderID: number) {
        const order = await this.ordersRepository.findOne({
            select: {
                orderedProducts: {
                    quantity: true,
                    product: {
                        productId: true,
                        productName: true,
                        productPrice: true,
                        productWeight: true,
                        productDescription: true
                    }
                },
                user: {
                    userFirstName: true,
                    userLastName: true,
                    userPhone: true
                }
            },
            relations: {
                orderedProducts: {
                    product: true
                },
                user: true
            },
            where: {
                orderId: orderID
            }
        });
        if (!order) {
            throw new HttpException('There is no such order', HttpStatus.NOT_FOUND);
        }
        return order;
    }

    async findUserOrders(userName: string, orderStatusID: number) {
        const user = await this.usersService.findUserByLogin(userName);
        let orders: Order[];
        if (orderStatusID) {
            const orderStatus: OrderStatus = await this.ordersStatusesService.findOrderStatus(orderStatusID);
            orders = await this.ordersRepository.find({
                select: {
                    orderedProducts: {
                        quantity: true,
                        product: {
                            productId: true,
                            productName: true,
                            productPrice: true,
                            productWeight: true,
                            productDescription: true
                        }
                    },
                    user: {
                        userFirstName: true,
                        userLastName: true,
                        userPhone: true
                    }
                },
                relations: {
                    orderedProducts: {
                        product: true
                    },
                    user: true
                },
                where: {
                    user: user,
                    orderStatus: orderStatus
                }
            });
        } else {
            orders = await this.ordersRepository.find({
                select: {
                    orderedProducts: {
                        quantity: true,
                        product: {
                            productId: true,
                            productName: true,
                            productPrice: true,
                            productWeight: true,
                            productDescription: true
                        }
                    },
                    user: {
                        userFirstName: true,
                        userLastName: true,
                        userPhone: true
                    }
                },
                relations: {
                    orderedProducts: {
                        product: true
                    },
                    user: true
                },
                where: {
                    user: user,

                }
            });
        }
        if (orders.length < 1) {
            throw new HttpException('User has no orders', HttpStatus.NOT_FOUND);
        }
        return orders;
    }

    async createNewOrder(createOrderDto: CreateOrderDto) {
        const orderStatus: OrderStatus = await this.ordersStatusesService.findOrderStatus(createOrderDto.orderStatus);
        const user: User = await this.usersService.findUser(createOrderDto.username);
        return this.entityManager.transaction(async (entityManager) => {
            const order = new Order();
            order.user = user;
            order.orderStatus = orderStatus;
            order.totalPrice = 0;
            order.totalWeight = 0;
            await entityManager.save(Order, order);
            for (const orderedProductData of createOrderDto.orderedProducts) {
                const product: Product = await this.productsService.findProductById(orderedProductData.productId);
                const orderedProduct = new OrderedProduct();
                orderedProduct.quantity = orderedProductData.quantity;
                orderedProduct.product = product;
                orderedProduct.order = order;
                await entityManager.save(OrderedProduct, orderedProduct);
                order.totalPrice = order.totalPrice + (orderedProduct.product.productPrice * orderedProduct.quantity);
                order.totalWeight = order.totalWeight + (
                    orderedProduct.product.productWeight * orderedProduct.quantity
                );
                await entityManager.save(Order, order);
            }
        });
    }

    async findOrdersByStatus(id: number) {
        const orderStatus: OrderStatus = await this.ordersStatusesService.findOrderStatus(id);
        const orders: Order[] = await this.ordersRepository.find({
            select: {
                orderedProducts: {
                    quantity: true,
                    product: {
                        productId: true,
                        productName: true,
                        productPrice: true,
                        productWeight: true,
                        productDescription: true
                    }
                },
                user: {
                    userFirstName: true,
                    userLastName: true,
                    userPhone: true
                }
            },
            relations: {
                orderedProducts: {
                    product: true
                },
                user: true
            },
            where: {
                orderStatus: orderStatus
            }
        });
        return orders;
    }

    async updateOrderById(id: number, updateOrderDto: UpdateOrderDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const order = await entityManager.findOne(Order, {
                where: {
                    orderId: id
                }
            });
            if (!order) {
                throw new HttpException('There is no such order', HttpStatus.NOT_FOUND);
            }

            const newOrderStatus: OrderStatus = await this.ordersStatusesService.findOrderStatus(updateOrderDto.orderStatus);
            order.orderStatus = newOrderStatus;
            for (const orderedProduct of updateOrderDto.orderedProducts) {
                const product: Product = await this.productsService.findProductById(orderedProduct.productId);
                const newOrderedProduct = new OrderedProduct();
                newOrderedProduct.quantity = orderedProduct.quantity;
                newOrderedProduct.product = product;
                newOrderedProduct.order = order;
                await entityManager.save(OrderedProduct, newOrderedProduct);
                order.totalPrice += (newOrderedProduct.product.productPrice * newOrderedProduct.quantity);
                order.totalWeight += (newOrderedProduct.product.productWeight * newOrderedProduct.quantity);
            }
            await entityManager.save(Order, order);
        });
    }

    async changeOrderStatus(id: number, statusId: number) {
        return this.entityManager.transaction(async (entityManager) => {
            const order: Order = await entityManager.findOne(Order, {
                where: {
                    orderId: id
                }
            });
            const newOrderStatus = await this.ordersStatusesService.findOrderStatus(statusId);
            if (await this.ordersStatusesService.validateOrderStatus(order.orderStatus, newOrderStatus)) {
                order.orderStatus = newOrderStatus;
                await entityManager.save(Order, order);
            }
        });
    }

}
