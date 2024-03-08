import {Module} from '@nestjs/common';
import {ReviewsService} from "./reviews.service";
import {UsersModule} from "../users/users.module";
import {ApartmentModule} from "../apartment/apartment.module";
import {JwtModule} from "@nestjs/jwt";
import {ApartmentService} from "../apartment/apartment.service";
import {UsersService} from "../users/users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Apartment} from "../typeorm/Apartment";
import {Feature} from "../typeorm/Feature";
import {User} from "../typeorm/User";
import {Message} from "../typeorm/Message";

import {Review} from "../typeorm/Review";
import {ReviewsController} from "./reviews.controller";
import {Connection} from "../typeorm/Connection";

@Module({
  imports: [ApartmentModule,UsersModule, JwtModule, TypeOrmModule.forFeature([Review, Apartment, User, Feature, Message, Connection])],
  providers: [ReviewsService, ApartmentService, UsersService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}