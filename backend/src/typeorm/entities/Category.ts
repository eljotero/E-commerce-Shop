import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Product } from './Product'

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn({ type: 'integer' })
    categoryId: number

    @Column({ type: 'varchar', length: 50, unique: true })
    categoryName: string

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
