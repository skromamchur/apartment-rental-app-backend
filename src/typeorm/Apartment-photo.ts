import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Apartment} from "./Apartment";

@Entity()
export class ApartmentPhoto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @ManyToOne(() => Apartment, apartment => apartment.photos, {
        onDelete: 'CASCADE'
    })
    apartment: Apartment;
}