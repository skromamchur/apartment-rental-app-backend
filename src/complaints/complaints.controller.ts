import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import {Complaint} from "../typeorm/Complaint";

@Controller('complaints')
export class ComplaintsController {
    constructor(private readonly complaintsService: ComplaintsService) {}

    @Get()
    async findAll(): Promise<Complaint[]> {
        return this.complaintsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Complaint> {
        return this.complaintsService.findOne(+id);
    }

    @Post()
    async create(@Body() complaintDTO: { apartmentId: string; userId: string; text: string; reportedUser : string }): Promise<Complaint> {
        return this.complaintsService.create(complaintDTO);
    }
}