import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { OrderedProduct } from "./OrderedProduct";

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn()
    productId: number

    @Column({ type: 'varchar', length: 100 })
    productName: string

    @Column({ type: 'varchar', length: 255 })
    productDescription: string

    @Column({ type: 'numeric' })
    productPrice: number

    @Column({ type: 'numeric' })
    productWeight: number

    @ManyToOne(() => Category, category => category.categoryId)
    category: Category;

    @OneToMany(() => OrderedProduct, orderedProduct => orderedProduct.product)
    orderedProducts: OrderedProduct[];
}