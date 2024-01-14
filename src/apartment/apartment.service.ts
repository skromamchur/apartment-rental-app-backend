import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Apartment} from "../typeorm/Apartment";
import {Between, In, Like, Repository} from "typeorm";

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
  ) {}

  async findAll({
    search = '',
    minPrice,
    maxPrice,
    roomCount,
    minFloor,
    maxFloor,
    minSquare,
    maxSquare,
    type,
  }: {
    search: string;
    minPrice: number;
    maxPrice: number;
    roomCount: number[];
    minFloor: number;
    maxFloor: number;
    minSquare: number;
    maxSquare: number;
    type: string[];
  }): Promise<Apartment[]> {
    return this.apartmentRepository.find({
      where: {
        title: Like(`%${search}%`),
        price: Between(minPrice, maxPrice),
        rooms: In(roomCount),
        floorNumber: Between(minFloor, maxFloor),
        square: Between(minSquare, maxSquare),
        type: In(type),
      },
    });
  }

  async findOne(id: number): Promise<Apartment> {
    return this.apartmentRepository.findOneById(id);
  }

  async create(apartmentData: Apartment): Promise<Apartment> {
    const newApartment = this.apartmentRepository.create(apartmentData);
    return this.apartmentRepository.save(newApartment);
  }

  async remove(id: number): Promise<void> {
    await this.apartmentRepository.delete(id);
  }
}
