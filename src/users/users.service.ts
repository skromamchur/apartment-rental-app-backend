import {BadRequestException, Injectable} from '@nestjs/common';
import {User} from "../typeorm/User";

import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {SignUpDto} from "../dto/SignUpDto";

import {NotFoundException} from "@nestjs/common";
import {UpdateUserDto} from "../dto/UpdateUserDto";

import {Message} from "../typeorm/Message";

import {Connection} from "../typeorm/Connection";

import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";

import {HttpStatus} from "@nestjs/common";


import {HttpException} from "@nestjs/common";
@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}
  async create(registerUserDto: SignUpDto): Promise<User> {
    const { email, password, firstName, lastName } = registerUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await this.userRepository.findOne({ where : { email}});
    if (existingUser) {
      throw new HttpException({
        statusCode: HttpStatus.FORBIDDEN,
        error: 'User with this email already exist',
      }, HttpStatus.FORBIDDEN);
    }

    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.password = hashedPassword;
    user.lastName = lastName;

    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where({ id: id })
      .select(['user.id', 'user.firstName', 'user.lastName', 'user.avatar', 'user.email', 'user.phone'])
      .leftJoinAndSelect('user.connections', 'connections')
      .leftJoinAndSelect('user.receivedConnections', 'receivedConnections')
      .leftJoin('connections.from', 'from')
      .addSelect(['from.id', 'from.avatar', 'from.lastName', 'from.firstName'])
      .leftJoin('connections.to', 'to')
      .addSelect(['to.id', 'to.avatar', 'to.lastName', 'to.firstName'])
      .leftJoin('receivedConnections.from', 'receivedFrom')
      .addSelect([
        'receivedFrom.id',
        'receivedFrom.avatar',
        'receivedFrom.lastName',
        'receivedFrom.firstName',
      ])
      .leftJoin('receivedConnections.to', 'receivedTo')
      .addSelect([
        'receivedTo.id',
        'receivedTo.avatar',
        'receivedTo.lastName',
        'receivedTo.firstName',
      ])
      .leftJoinAndSelect('connections.messages', 'messages')
      .leftJoin('messages.from', 'messageFrom')
      .addSelect(['messageFrom.id'])
      .leftJoinAndSelect('messages.photos', 'photos')
      .leftJoinAndSelect('receivedConnections.messages', 'receivedMessages')
      .leftJoin('receivedMessages.from', 'receivedMessageFrom')
      .addSelect(['receivedMessageFrom.id'])
      .leftJoinAndSelect('receivedMessages.photos', 'receivedPhotos')
      .getOne();
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
