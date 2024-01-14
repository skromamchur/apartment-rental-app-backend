import { Module } from '@nestjs/common';
import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from '../typeorm/Apartment';
import { GoogleMapsModule } from '../googlemaps/google-maps.module';
import {HttpModule} from "@nestjs/axios";
import {GoogleMapsService} from "../googlemaps/google-maps.service";

@Module({
  imports: [HttpModule, GoogleMapsModule, TypeOrmModule.forFeature([Apartment])],
  controllers: [ApartmentController],
  providers: [ApartmentService, GoogleMapsService],
})
export class ApartmentModule {}
