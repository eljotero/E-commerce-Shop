import { Injectable } from '@nestjs/common';
import { UserAddress } from '../../typeorm/entities/UserAddress';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserAddressDto } from 'src/useraddresses/dtos/CreateUserAddress.dto';

@Injectable()
export class UserAddressesService {
    constructor(@InjectRepository(UserAddress) private userAddressRepository: Repository<UserAddress>,
        private entityManager: EntityManager) { }

    async createUserAddress(addressData: createUserAddressDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const newAddress = this.userAddressRepository.create(
                addressData
            );
            await this.userAddressRepository.save(newAddress);
            return newAddress;
        });
    }
}
