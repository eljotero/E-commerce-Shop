import { Injectable } from '@nestjs/common';
import { UserAddress } from '../../typeorm/entities/UserAddress';
import { EntityManager } from 'typeorm';
import { createUserAddressDto } from 'src/useraddresses/dtos/CreateUserAddress.dto';

@Injectable()
export class UserAddressesService {
    constructor(
        private entityManager: EntityManager) { }

    async createUserAddress(addressData: createUserAddressDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const newAddress = new UserAddress();
            newAddress.zipCode = addressData.zipCode;
            newAddress.country = addressData.country;
            newAddress.city = addressData.city;
            newAddress.address = addressData.address;
            await entityManager.insert(UserAddress, newAddress);
            return newAddress;
        });
    }
}
