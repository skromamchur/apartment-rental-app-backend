import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../typeorm/User";
import {Message} from "../typeorm/Message";
import {JwtModule} from "@nestjs/jwt";
import {Connection} from "../typeorm/Connection";

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Connection]), JwtModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
