import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { UserAddress } from "./UserAddress"
import { Order } from './Order'

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    userId: number

    @Column({ type: 'varchar', length: 50, unique: true })
    userLogin: string

    @Column({ type: 'varchar', length: 50 })
    userFirstName: string

    @Column({ type: 'varchar', length: 50 })
    userLastName: string

    @Column({ type: "varchar" })
    userPassword: string

    @Column({ type: 'varchar', length: 50 })
    userEmail: string

    @Column({ type: 'varchar', length: 15 })
    userPhone: string

    @Column({ type: 'date', default: new Date() })
    createdAt: Date

    @ManyToMany(() => UserAddress)
    @JoinTable()
    addresses: UserAddress[]

    @OneToMany(() => Order, order => order.user)
    orders: Order[]
}
