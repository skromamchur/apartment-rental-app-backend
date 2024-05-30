import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Complaint} from "../typeorm/Complaint";
import {User} from "../typeorm/User";
import {Apartment} from "../typeorm/Apartment";

@Injectable()
export class ComplaintsService {
    constructor(
        @InjectRepository(Complaint)
        private complaintsRepository: Repository<Complaint>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Apartment)
        private apartmentsRepository: Repository<Apartment>,
    ) {}

    async findAll(): Promise<Complaint[]> {
        return this.complaintsRepository.find({ relations: ['user', 'apartment', 'reportedUser'] });
    }

    async findOne(id: number): Promise<Complaint> {
        return this.complaintsRepository.findOneById(id);
    }

    async create(complaintDTO: { apartmentId: string; userId: string; text: string; reportedUser }): Promise<Complaint> {
        const user = await this.usersRepository.findOneById(complaintDTO.userId);
        const reportedUser = await this.usersRepository.findOneById(complaintDTO.reportedUser);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const apartment = await this.apartmentsRepository.findOneById(complaintDTO.apartmentId);
        if (!apartment) {
            throw new NotFoundException('Apartment not found');
        }

        const complaint = new Complaint();
        complaint.text = complaintDTO.text;
        complaint.user = user;
        complaint.reportedUser = reportedUser;
        complaint.apartment = apartment;

        return this.complaintsRepository.save(complaint);
    }
}
