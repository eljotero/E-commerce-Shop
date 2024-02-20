import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { OrderStatus } from "./OrderStatus"
import { OrderedProduct } from "./OrderedProduct"
import { User } from './User'
@Entity({ name: 'orders' })
export class Order {

    @PrimaryGeneratedColumn()
    orderId: number

    @Column({default: new Date() })
    orderDate: Date;

    @Column({type: "numeric" })
    totalPrice: number;

    @Column({type: 'numeric' })
    totalWeight: number;

    @ManyToOne(() => OrderStatus, orderStatus => orderStatus.orders)
    orderStatus: OrderStatus;

    @OneToMany(() => OrderedProduct, orderedProduct => orderedProduct.order)
    orderedProducts: OrderedProduct[];

    @ManyToOne(() => User, user => user.orders)
    user: User;
}