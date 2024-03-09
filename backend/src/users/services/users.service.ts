import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../typeorm/entities/User'
import { Repository, EntityManager } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import * as bcrypt from 'bcrypt';
import { UserAddressesService } from '../../useraddresses/services/useraddresses.service';
import { createUserAddressDto } from 'src/useraddresses/dtos/CreateUserAddress.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { CreateAdminDto } from '../dtos/CreateAdmin.dto';
import { UserRoles } from '../../auth/enums/user-roles';

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
            where: { userId: id },
            select: {
                addresses: true
            },
            relations: {
                addresses: true
            }
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
        const { userPassword, ...newUser } = user;
        return newUser;
    }

    async findUser(login: string) {
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
            const newUser = new User();
            newUser.userPassword = newUserData.userPassword;
            newUser.userLogin = newUserData.userLogin;
            newUser.userFirstName = newUserData.userFirstName;
            newUser.userLastName = newUserData.userLastName;
            newUser.userEmail = newUserData.userEmail;
            newUser.userPhone = newUserData.userPhone;
            const addressData: createUserAddressDto = {
                zipCode, city, country, address
            }
            const newUserAddress = await this.userAddressesService.createUserAddress(addressData)
            newUser.addresses = [newUserAddress];
            await entityManager.save(newUser);
            return {
                userId: newUser.userId,
                userLogin: newUser.userLogin,
                userFirstName: newUser.userFirstName,
                userLastName: newUser.userLastName,
                userEmail: newUser.userEmail,
                userPhone: newUser.userPhone,
                addresses: newUser.addresses
            }
        });
    }

    async createAdmin(createAdminDto: CreateAdminDto) {
        return this.entityManager.transaction(async (entityManager) => {
            const { userPassword, ...adminDetailsWithoutPassword } = createAdminDto;
            const user: User = await entityManager.findOne(User, ({
                where: {
                    userLogin: adminDetailsWithoutPassword.userLogin
                }
            }));
            if (user) {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
            }
            const hashedPassword: string = await bcrypt.hash(userPassword, 10);
            const newUserData = {
                ...adminDetailsWithoutPassword,
                userPassword: hashedPassword
            };
            const newUser = new User();
            newUser.userPassword = newUserData.userPassword;
            newUser.userLogin = newUserData.userLogin;
            newUser.userFirstName = newUserData.userFirstName;
            newUser.userLastName = newUserData.userLastName;
            newUser.userEmail = newUserData.userEmail;
            newUser.userPhone = newUserData.userPhone;
            newUser.roles = UserRoles.Admin;
            await entityManager.save(newUser);
            return {
                userId: newUser.userId,
                userLogin: newUser.userLogin,
                userFirstName: newUser.userFirstName,
                userLastName: newUser.userLastName,
                userEmail: newUser.userEmail,
                userPhone: newUser.userPhone
            }
        });

    }

    async updateUser(login: string, userDetails: UpdateUserDto, req) {
        return this.entityManager.transaction(async (entityManager) => {
            const user: User = await entityManager.findOne(User, {
                where: {
                    userLogin: login
                }
            });
            if (user.roles === UserRoles.Admin && req.user.roles !== UserRoles.Root) {
                throw new HttpException('Only root can update admins profiles', HttpStatus.FORBIDDEN);
            }
            if (user.roles === UserRoles.Root && req.user.roles !== UserRoles.Root) {
                throw new HttpException('Only root can update roots profiles', HttpStatus.FORBIDDEN);
            }
            Object.assign(user, userDetails);
            entityManager.save(User, user);
            return {
                userId: user.userId,
                userLogin: user.userLogin,
                userFirstName: user.userFirstName,
                userLastName: user.userLastName,
                userEmail: user.userEmail,
                userPhone: user.userPhone,
                userAddresses: user.addresses
            }
        });
    }
}
