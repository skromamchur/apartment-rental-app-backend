import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {IsNotEmpty} from "class-validator";
import {ApartmentDealType} from "../types/Appartment";
import {ApartmentPhoto} from "./Apartment-photo";
import {OneToMany, OneToOne, JoinColumn, JoinTable, ManyToMany, ManyToOne, CreateDateColumn} from "typeorm";
import {Feature} from "./Feature";
import {User} from "./User";
import {BeforeInsert, BeforeUpdate} from "typeorm";


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

  @Column()
  @IsNotEmpty()
  locationId : string;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @OneToMany(() => ApartmentPhoto, photo => photo.apartment, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable()
  photos: ApartmentPhoto[];

  @Column({ nullable: true })
  previewPhotoId: number;

  @ManyToMany(() => Feature, { cascade: true })
  @JoinTable()
  features: Feature[];

  @ManyToOne(() => User, user => user.apartments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, type : "float" })
  pricePerSquare: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @BeforeInsert()
  setPricePerSquareBeforeInsert() {
    this.pricePerSquare = this.price / this.square;
  }

  @BeforeUpdate()
  setPricePerSquareBeforeUpdate() {
    this.pricePerSquare = this.price / this.square;
  }
}
