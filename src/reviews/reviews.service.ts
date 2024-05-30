import {Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Apartment} from "../typeorm/Apartment";
import {Repository} from "typeorm";
import {Feature} from "../typeorm/Feature";
import {Review} from "../typeorm/Review";
import {ReviewDto} from "../dto/ReviewDto";
import {HttpService} from "@nestjs/axios";
import {ApartmentService} from "../apartment/apartment.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class ReviewsService {
  constructor(
      @InjectRepository(Review)
      private readonly reviewRepository: Repository<Review>,
      private readonly apartmentService: ApartmentService,
      private readonly userService: UsersService
  ) {}

  async sendReview(reviewerId : number, apartmentId : number, reviewDto : ReviewDto ){
    const review = new Review();

    review.text = reviewDto.text;
    review.rating = reviewDto.rating;
    review.apartment =  await this.apartmentService.findOne(apartmentId);
    review.reviewer = await this.userService.findOne(reviewerId);

    this.reviewRepository.save(review);
  }

  async findAllReviews(){
    return await this.reviewRepository.find({
      relations : ['reviewer', 'apartment']
    });
  }
}