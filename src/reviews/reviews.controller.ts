import {Body, Controller, Post, Param, UseGuards, Request} from "@nestjs/common";
import {ReviewsService} from "./reviews.service";
import {ReviewDto} from "../dto/ReviewDto";

import {AuthGuard} from "../auth/auth.guard";

@Controller('reviews')
export class ReviewsController{
    constructor(
        private readonly reviewsService: ReviewsService,
    ) {}

    @Post('/:id')
    @UseGuards(AuthGuard)
    async sendReview(@Request() req, @Param('id') id : string, @Body() reviewDto : ReviewDto ): Promise<void> {
        await this.reviewsService.sendReview(req.user.sub, Number(id), reviewDto)
    }
}