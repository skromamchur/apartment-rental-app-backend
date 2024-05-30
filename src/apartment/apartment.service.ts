import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Apartment} from "../typeorm/Apartment";
import {Between, In, Like, Repository} from "typeorm";
import {Feature} from "../typeorm/Feature";

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
  ) {}

  async findAll({
    search = '',
    minPrice,
    maxPrice,
    roomCount,
    minFloor,
    maxFloor,
    minSquare,
    maxSquare,
    type,
      sort,
      state,
      city
  }: {
    search: string;
    minPrice: number;
    maxPrice: number;
    roomCount: number[];
    minFloor: number;
    maxFloor: number;
    minSquare: number;
    maxSquare: number;
    type: string[];
    sort : string
    state : string;
    city : string;
  }): Promise<any> {
    let order;

    if(sort === 'PRICE_ASC')
    {
      order = { price:  'ASC'}
    } else if(sort === 'PRICE_DESC'){
      order = { price:  'DESC'}
    } else if(sort === 'PRICE_PER_SQUARE_ASC'){
      order = { pricePerSquare : 'ASC'}
    } else if(sort === 'PRICE_PER_SQUARE_DESC'){
      order = { pricePerSquare : "DESC"}
    } else if(sort === 'DATE'){
      order = { createdAt: 'DESC'}
    }

    const data = await  this.apartmentRepository.find({
      where: {
        title: Like(`%${search}%`),
        price: Between(minPrice, maxPrice),
        rooms: In(roomCount),
        floorNumber: Between(minFloor, maxFloor),
        square: Between(minSquare, maxSquare),
        type: In(type),
      },
      order,
      relations: ['user', 'complaints']
    });

    const groupByAndCountArray = (elements, property) => {
      const dictionary = {};

      const states = elements.map(ap => ap[property])

      states.forEach(state => {
        if (!dictionary.hasOwnProperty(state)) {
          dictionary[state] = 1;
        } else {
          dictionary[state]++;
        }
      })

      const result = []

      Object.keys(dictionary).forEach((key) => {
        result.push({
          name : key,
          count : dictionary[key]
        })
      })

      return result;
    }

    return ({
      apartments : data.filter(ap => {
        if(!state){
          return true;
        } else {
          if(!city){
            return ap.state === state
          } else return ap.state === state && ap.city === city
        }
      }),
      states : groupByAndCountArray(data, 'state'),
      cities : groupByAndCountArray(data.filter(ap => ap.state === state), 'city')
    })
  }

  async findOne(id: number): Promise<Apartment> {
    return this.apartmentRepository.findOne({
      where : {id},
      relations : ['user', 'features', 'reviews', 'reviews.reviewer']
    });
  }

  async create(apartmentData: Apartment, featureNames): Promise<Apartment> {
    const newApartment = this.apartmentRepository.create(apartmentData);

    const features = await Promise.all(featureNames.map(name => this.getOrCreateFeature(name)));

    newApartment.features = features;

    return this.apartmentRepository.save(newApartment);
  }

  async getOrCreateFeature(name: string): Promise<Feature> {
    let feature = await this.featureRepository.findOne({ where: { name } });

    if (!feature) {
      feature = this.featureRepository.create({ name });
      feature = await this.featureRepository.save(feature);
    }

    return feature;
  }

  async remove(id: number): Promise<void> {
    await this.apartmentRepository.delete(id);
  }
}
