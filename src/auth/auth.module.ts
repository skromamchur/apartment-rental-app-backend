import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/User';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {Message} from "../typeorm/Message";
import {Connection} from "../typeorm/Connection";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Message, Connection]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [UsersService, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
