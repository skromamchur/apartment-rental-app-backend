import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards, Request
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { Apartment } from '../typeorm/Apartment';

import { NotFoundException } from '@nestjs/common';

import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";

import { diskStorage } from 'multer';
import { extname } from 'path';

import {ParseArrayPipe} from "@nestjs/common";
import {ApartmentPhoto} from "../typeorm/Apartment-photo";
import {Query} from "@nestjs/common";
import {
  APARTMENT_AVAILABLE_COUNT_OF_ROOMS,
  APARTMENT_MAX_FLOOR,
  APARTMENT_MAX_PRICE, APARTMENT_MAX_SQUARE,
  APARTMENT_MIN_FLOOR, APARTMENT_MIN_SQUARE, APARTMENT_TYPES
} from "../contants/Apartments";
import {ApartmentDTO} from "../dto/Appartment";
import {GoogleMapsService} from "../googlemaps/google-maps.service";
import {ApartmentDealType} from "../types/Appartment";
import * as process from "process";
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
      sort
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
  @UseInterceptors(
      FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      preservePath: false,
    }),
  )
  async create(
    @Body() apartmentData: ApartmentDTO,
    @UploadedFiles() photos: Express.Multer.File[],
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

      apartment.user = user;

      if (photos && photos.length > 0) {
        photos.forEach((photo, index) => {
          const apartmentPhoto = new ApartmentPhoto();
          apartmentPhoto.filename = `${process.env.API_URL}/uploads/${photo.filename}`;
          apartment.photos.push(apartmentPhoto);

          if (index === 0) {
            apartment.previewPhotoId = apartmentPhoto.id;
          }
        });
      }

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
}
