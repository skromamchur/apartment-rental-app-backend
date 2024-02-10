import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
    Put
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from '../dto/SignInDto';

import {AuthGuard} from "./auth.guard";
import {SignUpDto} from "../dto/SignUpDto";
import {UpdateUserDto} from "../dto/UpdateUserDto";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  async signUp(
    @Body() registerUserDto: SignUpDto,
  ) {
    return this.usersService.create(registerUserDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  updateProfile(@Request() req) {

    if(req.user) {
      const user = this.usersService.findOne(req.user.sub);

      return user;
    }

    return null;
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  getProfile(@Request() req, @Body() data : UpdateUserDto) {

    if(req.user) {
      this.usersService.update(req.user.sub, data);
    }

    return null;
  }
}
