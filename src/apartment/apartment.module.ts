import { Module } from '@nestjs/common';
import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from '../typeorm/Apartment';
import { GoogleMapsModule } from '../googlemaps/google-maps.module';
import {HttpModule} from "@nestjs/axios";
import {GoogleMapsService} from "../googlemaps/google-maps.service";
import {Feature} from "../typeorm/Feature";
import {UsersService} from "../users/users.service";
import {UsersModule} from "../users/users.module";
import {User} from "../typeorm/User";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [HttpModule, GoogleMapsModule, TypeOrmModule.forFeature([Apartment, Feature, User]), UsersModule, JwtModule],
  controllers: [ApartmentController],
  providers: [ApartmentService, GoogleMapsService, UsersService],
})
export class ApartmentModule {}
