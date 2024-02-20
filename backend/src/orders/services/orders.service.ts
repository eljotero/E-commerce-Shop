import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/typeorm/entities/Order';
import { UsersService } from 'src/users/services/users.service';
import { Repository, EntityManager } from 'typeorm';
import { CreateOrderDto } from '../dtos/CreateOrder.dto';
import { OrdersstatusesService } from 'src/ordersstatuses/services/ordersstatuses.service';
import { User } from 'src/typeorm/entities/User';
import { OrderStatus } from 'src/typeorm/entities/OrderStatus';
import { OrderedProduct } from 'src/typeorm/entities/OrderedProduct';
import { Product } from 'src/typeorm/entities/Product';
import { ProductsService } from 'src/products/services/products.service';

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
            throw new HttpException('There is no such order', HttpStatus.BAD_REQUEST);
        }
        return order;
    }

    async findUserOrders(userName: string) {
        const user = await this.usersService.findUserByLogin(userName);
        const orders = await this.ordersRepository.find({
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
                user: user
            }
        });
        if (orders.length < 1) {
            throw new HttpException('User has no orders', HttpStatus.NOT_FOUND);
        }
        return orders;
    }

    async createOrder(createOrderDto: CreateOrderDto) {
        const orderStatus: OrderStatus = await this.ordersStatusesService.findOrderStatus(createOrderDto.orderStatus);
        const user: User = await this.usersService.findUserByLogin(createOrderDto.username);
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

}
