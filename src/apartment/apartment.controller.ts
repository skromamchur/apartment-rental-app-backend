import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { Apartment } from '../typeorm/Apartment';

@Controller('apartments')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Get()
  async findAll(): Promise<Apartment[]> {
    return this.apartmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Apartment> {
    return this.apartmentService.findOne(id);
  }

  @Post()
  async create(@Body() apartmentData: Apartment): Promise<Apartment> {
    return this.apartmentService.create(apartmentData);
  }
}
