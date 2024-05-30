import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import {Complaint} from "../typeorm/Complaint";
import {User} from "../typeorm/User";
import {Apartment} from "../typeorm/Apartment";

@Module({
    imports: [TypeOrmModule.forFeature([Complaint, User, Apartment])],
    providers: [ComplaintsService],
    controllers: [ComplaintsController]
})
export class ComplaintsModule {}
