import { Module } from '@nestjs/common';
import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Apartment} from "../typeorm/Apartment";

@Module({
  imports: [TypeOrmModule.forFeature([Apartment])],
  controllers: [ApartmentController],
  providers: [ApartmentService]
})
export class ApartmentModule {}
