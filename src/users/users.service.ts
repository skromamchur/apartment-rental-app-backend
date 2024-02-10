import { Injectable } from '@nestjs/common';
import {User} from "../typeorm/User";

import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {SignUpDto} from "../dto/SignUpDto";

import {NotFoundException} from "@nestjs/common";
import {UpdateUserDto} from "../dto/UpdateUserDto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    async create(registerUserDto: SignUpDto): Promise<User> {
        const { email, password, firstName, lastName } = registerUserDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User();
        user.email = email;
        user.firstName = firstName
        user.password = hashedPassword;
        user.lastName = lastName

        return this.userRepository.save(user);
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOneById(id);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { email, firstName, lastName, phone, avatar } = updateUserDto;

        const user = await this.userRepository.findOneById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (email) {
            user.email = email;
        }

        if (firstName) {
            user.firstName = firstName;
        }

        if (lastName) {
            user.lastName = lastName;
        }

        user.avatar = avatar;
        user.phone = phone;

        return this.userRepository.save(user);
    }
}
