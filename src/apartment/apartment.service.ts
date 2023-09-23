import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Apartment} from "../typeorm/Apartment";
import {Repository} from "typeorm";

@Injectable()
export class ApartmentService {
    constructor(@InjectRepository(Apartment) private readonly apartmentRepository: Repository<Apartment>) {}

    async findAll() : Promise<Apartment[]>{
        return this.apartmentRepository.find()
    }

    async findOne(id : number): Promise<Apartment>{
        return this.apartmentRepository.findOneById(id);
    }

    async create(apartmentData: Apartment): Promise<Apartment> {
        const newApartment = this.apartmentRepository.create(apartmentData);
        return this.apartmentRepository.save(newApartment);
    }
}
