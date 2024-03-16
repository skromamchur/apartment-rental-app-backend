import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { Apartment } from '../typeorm/Apartment';

import { NotFoundException } from '@nestjs/common';
import {ParseArrayPipe} from "@nestjs/common";
import {Query} from "@nestjs/common";
import {
  APARTMENT_AVAILABLE_COUNT_OF_ROOMS,
  APARTMENT_MAX_FLOOR,
  APARTMENT_MAX_PRICE, APARTMENT_MAX_SQUARE,
  APARTMENT_MIN_FLOOR, APARTMENT_MIN_SQUARE, APARTMENT_TYPES
} from "../contants/Apartments";
import {ApartmentDTO} from "../dto/Appartment";
import {GoogleMapsService} from "../googlemaps/google-maps.service";
import {AuthGuard} from "../auth/auth.guard";
import {UsersService} from "../users/users.service";

@Controller('apartments')
export class ApartmentController {
  constructor(
    private readonly apartmentService: ApartmentService,
    private readonly googleMapsService: GoogleMapsService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  async findAll(
    @Query('search') search: string = '',
    @Query('state') state: string = '',
    @Query('city') city: string = '',
    @Query('minPrice') minPrice: number = 0,
    @Query('maxPrice') maxPrice: number = APARTMENT_MAX_PRICE,
    @Query('roomCount', new ParseArrayPipe({ items: Number, separator: ',' }))
    roomCount: number[] = APARTMENT_AVAILABLE_COUNT_OF_ROOMS,
    @Query('type', new ParseArrayPipe({ items: String, separator: ',' }))
        type: string[] = APARTMENT_TYPES,
    @Query('minFloor') minFloor: number = APARTMENT_MIN_FLOOR,
    @Query('maxFloor') maxFloor: number = APARTMENT_MAX_FLOOR,
    @Query('minSquare') minSquare: number = APARTMENT_MIN_SQUARE,
    @Query('maxSquare') maxSquare: number = APARTMENT_MAX_SQUARE,
    @Query('sortType') sort: string = 'date'
  ): Promise<Apartment[]> {
    return this.apartmentService.findAll({
      search,
      minPrice,
      maxPrice,
      roomCount,
      minFloor,
      maxFloor,
      minSquare,
      maxSquare,
      type,
      sort,
      state,
      city
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Apartment> {
    const apartment = await this.apartmentService.findOne(id);
    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }
    return apartment;
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() apartmentData: ApartmentDTO,
    @Request() req
  ): Promise<Apartment> {
    try {
      const user = await this.usersService.findOne(req.user.sub);
      const featureNames = apartmentData.features ?? [];

      const locationId: string = apartmentData.locationId;

      const placeDetails = await this.googleMapsService.getPlaceDetails(locationId);

      const apartment = new Apartment();

      apartment.square = apartmentData.square;
      apartment.price = apartmentData.price;
      apartment.title = apartmentData.title;
      apartment.description = apartmentData.description;
      apartment.floorNumber = apartmentData.floorNumber;
      apartment.totalFloors = apartmentData.totalFloors;
      apartment.rooms = apartmentData.rooms;
      apartment.locationId = apartmentData.locationId;

      apartment.street = placeDetails.street;
      apartment.city = placeDetails.city;
      apartment.state = placeDetails.state;
      apartment.lat = placeDetails.lat;
      apartment.lng = placeDetails.lng;

      apartment.type = apartmentData.type;

      apartment.photos = [];
      apartment.reviews = [];

      apartment.user = user;

      apartment.photos = apartmentData.photos;

      return this.apartmentService.create(apartment, featureNames);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.apartmentService.remove(id);
  }

  // @Post(':id/reviews')
  // async review(@Param('id') id: number): Promise<void> {
  //   return this.apartmentService.remove(id);
  // }
}
