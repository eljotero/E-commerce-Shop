import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../typeorm/entities/User'
import { Repository, EntityManager } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import * as bcrypt from 'bcrypt';
import { UserAddressesService } from 'src/useraddresses/services/useraddresses.service';
import { createUserAddressDto } from 'src/useraddresses/dtos/CreateUserAddress.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
        private userAddressesService: UserAddressesService,
        private entityManager: EntityManager) { }

    async findUsers() {
        const users: User[] = await this.userRepository.find();
        const newUsers = users.map(({ userPassword, ...user }) => user);
        return newUsers;
    }

    async findUserById(id: number) {
        const user: User = await this.userRepository.findOne({
            where: { userId: id }
        })
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        const { userPassword, ...newUser } = user;
        return newUser;
    }

    async findUserByLogin(login: string) {
        const user: User = await this.userRepository.findOne({
            where: {
                userLogin: login
            }
        });
        if (!user) {
            throw new HttpException('There is no such user', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    async createUser(userDetails: CreateUserDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const { userPassword, zipCode, city, country, address, ...userDetailsWithoutPassword } = userDetails;
            const user: User = await entityManager.findOne(User, ({
                where: {
                    userLogin: userDetailsWithoutPassword.userLogin
                }
            }))
            if (user) {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
            }
            const hashedPassword: string = await bcrypt.hash(userPassword, 10);
            const newUserData = {
                ...userDetailsWithoutPassword,
                userPassword: hashedPassword
            };
            const newUser: User = entityManager.create(User, newUserData);
            const addressData: createUserAddressDto = {
                zipCode, city, country, address
            }
            const newUserAddress = await this.userAddressesService.createUserAddress(addressData)
            newUser.addresses = [newUserAddress];
            await entityManager.save(newUser);
            return {
                statusCode: HttpStatus.OK,
                message: 'User created successfully'
            };
        });
    }

    async updateUser(login: string, userDetails: UpdateUserDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const user = await this.findUserByLogin(login);
            Object.assign(user, userDetails);
            entityManager.save;
        })

    }
}
