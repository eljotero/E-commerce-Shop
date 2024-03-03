import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../typeorm/entities/Order';
import { UsersService } from '../../users/services/users.service';
import { Repository, EntityManager } from 'typeorm';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { OrdersstatusesService } from '../../ordersstatuses/services/ordersstatuses.service';
import { User } from '../../typeorm/entities/User';
import { OrderStatus, OrderStatusEnum } from '../../typeorm/entities/OrderStatus';
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
                },
                orderStatus: {
                    orderStatusId: true
                }
            },
            relations: {
                orderedProducts: {
                    product: true
                },
                user: true,
                orderStatus: true
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
                    },
                    orderStatus: {
                        status: true
                    }
                },
                relations: {
                    orderedProducts: {
                        product: true
                    },
                    user: true,
                    orderStatus: true
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
                const product: Product = await entityManager.findOne(Product, {
                    where: {
                        productId: orderedProductData.productId
                    }
                });
                if (!product) {
                    throw new HttpException('There is no such product', HttpStatus.NOT_FOUND);
                }
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
            return {
                orderStatus: orderStatus.status,
                totalPrice: order.totalPrice,
                totalWeight: order.totalWeight,
                orderId: order.orderId,
                orderDate: order.orderDate
            };
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

            const newOrderStatus: OrderStatus = await entityManager.findOne(OrderStatus, {
                where: {
                    orderStatusId: updateOrderDto.orderStatus
                }
            });
            if (!newOrderStatus) {
                throw new HttpException('There is no such order status', HttpStatus.NOT_FOUND);
            }
            order.orderStatus = newOrderStatus;
            for (const orderedProduct of updateOrderDto.orderedProducts) {
                const product: Product = await entityManager.findOne(Product, {
                    where: {
                        productId: orderedProduct.productId
                    }
                });
                if (!product) {
                    throw new HttpException('There is no such product', HttpStatus.NOT_FOUND);
                }
                const newOrderedProduct = new OrderedProduct();
                newOrderedProduct.quantity = orderedProduct.quantity;
                newOrderedProduct.product = product;
                newOrderedProduct.order = order;
                await entityManager.save(OrderedProduct, newOrderedProduct);
                order.totalPrice = 0;
                order.totalWeight = 0;
                order.totalPrice += (newOrderedProduct.product.productPrice * newOrderedProduct.quantity);
                order.totalWeight += (newOrderedProduct.product.productWeight * newOrderedProduct.quantity);
            }
            await entityManager.save(Order, order);
            return {
                orderStatus: newOrderStatus.status,
                totalPrice: order.totalPrice,
                totalWeight: order.totalWeight,
                orderId: order.orderId,
                orderDate: order.orderDate
            };
        });
    }

    async changeOrderStatus(id: number, statusId: number) {
        return this.entityManager.transaction(async (entityManager) => {
            const order: Order = await entityManager.findOne(Order, {
                select: {
                    orderStatus: {
                        status: true
                    }
                },
                where: {
                    orderId: id
                },
                relations: {
                    orderStatus: true
                }
            });
            if (!order) {
                throw new HttpException('There is no such order', HttpStatus.NOT_FOUND);
            }
            const newOrderStatus: OrderStatus = await entityManager.findOne(OrderStatus, {
                where: {
                    orderStatusId: statusId
                }
            });
            if (!newOrderStatus) {
                throw new HttpException('There is no such order status', HttpStatus.NOT_FOUND);
            }
            if (this.validateOrderStatus(order.orderStatus, newOrderStatus)) {
                order.orderStatus = newOrderStatus;
                await entityManager.save(Order, order);
            }
        });
    }

    async deleteOrderById(id: number) {
        return this.entityManager.transaction(async (entityManager) => {
            const order: Order = await entityManager.findOne(Order, {
                where: {
                    orderId: id
                },
                relations: ['orderedProducts']
            });
            if (!order) {
                throw new HttpException('There is no such order', HttpStatus.NOT_FOUND);
            }
            for (const orderedProduct of order.orderedProducts) {
                await entityManager.remove(OrderedProduct, orderedProduct);
            }
            await entityManager.remove(Order, order);
        });
    }

    validateOrderStatus(orderStatus: OrderStatus, newOrderStatus: OrderStatus) {
        if (orderStatus.status === OrderStatusEnum.DELIVERED) {
            throw new HttpException('Order is already delivered', HttpStatus.BAD_REQUEST);
        } else if (orderStatus.status === newOrderStatus.status) {
            throw new HttpException('New order status is same as old order status', HttpStatus.CONFLICT);
        } else if (orderStatus.status === OrderStatusEnum.APPROVED && newOrderStatus.status === OrderStatusEnum.UNAPPROVED) {
            throw new HttpException('Order is already approved', HttpStatus.BAD_REQUEST);
        } else if (orderStatus.status === OrderStatusEnum.CANCELED) {
            throw new HttpException('Order is already canceled', HttpStatus.BAD_REQUEST);
        }
        return true;
    }

}
