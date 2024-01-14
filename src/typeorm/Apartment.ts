import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {IsNotEmpty} from "class-validator";
import {ApartmentDealType} from "../types/Appartment";

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  @IsNotEmpty()
  state: string;

  @Column()
  @IsNotEmpty()
  type :ApartmentDealType;

  @Column()
  @IsNotEmpty()
  city: string;

  @Column()
  @IsNotEmpty()
  street: string;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNotEmpty()
  square: number;

  @Column()
  @IsNotEmpty()
  rooms: number;

  @Column()
  @IsNotEmpty()
  floorNumber: number;

  @Column()
  @IsNotEmpty()
  totalFloors: number;

  @Column({ nullable: true })
  photo: string;
}
