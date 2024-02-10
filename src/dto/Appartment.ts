import { IsString, IsNotEmpty } from 'class-validator';
import {ApartmentDealType} from "../types/Appartment";

export class ApartmentDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    description: string;

    price: number;

    square: number;

    rooms: number;

    floorNumber: number;

    totalFloors: number;

    @IsString()
    @IsNotEmpty()
    locationId: string;

    @IsString()
    @IsNotEmpty()
    type : ApartmentDealType;

    features : string[];
}