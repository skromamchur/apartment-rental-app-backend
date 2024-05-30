import {Controller, Get} from '@nestjs/common';

import {UsersService} from "./users.service";

import {User} from "../typeorm/User";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers(): Promise<User[]> {
        return await this.usersService.findAll();
    }
}
