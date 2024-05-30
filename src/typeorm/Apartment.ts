import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {IsNotEmpty} from "class-validator";
import {ApartmentDealType} from "../types/Appartment";
import {OneToMany, JoinColumn, JoinTable, ManyToMany, ManyToOne, CreateDateColumn} from "typeorm";
import {Feature} from "./Feature";
import {User} from "./User";
import {BeforeInsert, BeforeUpdate} from "typeorm";
import {Review} from "./Review";
import {Complaint} from "./Complaint";


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


  @Column({ default : "deny"})
  @IsNotEmpty()
  allowChildren : "allow" | "deny"

  @Column({ default : "цегляний"})
  @IsNotEmpty()
  wallsType : "панельний" | "цегляний" | "газоблок"

  @Column({ default : "deny"})
  @IsNotEmpty()
  allowPets : "allow" | "deny"

  @Column({ default : "individual"})
  @IsNotEmpty()
  warmingType : "individual" | "center"

  @Column({ default : "40+"})
  @IsNotEmpty()
  buildAge : string;

  @Column({ default : "adjacent"})
  @IsNotEmpty()
  plan : "separate" | "adjacent"

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @Column('text' , {array : true})
  photos : string[];

  @OneToMany(() => Review, review => review.apartment, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable()
  reviews: Review[];

  @Column({ nullable: true })
  previewPhotoId: number;

  @Column({ default: false, nullable : true })
  watched: boolean;

  @ManyToMany(() => Feature, { cascade: true })
  @JoinTable()
  features: Feature[];

  @ManyToOne(() => User, user => user.apartments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, type : "float" })
  pricePerSquare: number;

  @OneToMany(() => Complaint, complaint => complaint.apartment, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable()
  complaints: Complaint[];


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
