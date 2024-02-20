import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserAddress {
    @PrimaryGeneratedColumn()
    userAddressId: number

    @Column({ type: 'varchar', length: 16 })
    zipCode: string

    @Column({ type: 'varchar', length: 60 })
    city: string

    @Column({ type: 'varchar', length: 20 })
    country: string

    @Column({ type: 'varchar', length: 50 })
    address: string

}
