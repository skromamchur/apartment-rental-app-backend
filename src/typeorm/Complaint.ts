import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {User} from "./User";
import {Apartment} from "./Apartment";

@Entity()
export class Complaint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => User, user => user.complaints)
    user: User;

    @ManyToOne(() => User, user => user.reports)
    reportedUser: User;

    @ManyToOne(() => Apartment, apartment => apartment.complaints)
    apartment: Apartment;

    @Column({ default : false })
    watched: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}