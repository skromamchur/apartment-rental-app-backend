import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {GoogleMapsService} from "./google-maps.service";
import {ApartmentDTO} from "../dto/Appartment";

@Controller('maps')
export class GoogleMapsController{
    constructor(
        private readonly googleMapsService: GoogleMapsService,
    ) {}

    @Post()
    async getByCoors( @Body() {lat, lng}: { lat : number; lng : number} ): Promise<{  result : string; geometry : any}> {
        const { result, geometry} = await this.googleMapsService.getPlaceByCoords({lat, lng});

        return {result, geometry};
    }
}