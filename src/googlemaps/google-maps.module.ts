import {Get, Module, Param} from '@nestjs/common';
import {GoogleMapsService} from "./google-maps.service";
import {HttpModule} from "@nestjs/axios";


@Module({
    imports: [HttpModule],
    providers: [GoogleMapsService]
})
export class GoogleMapsModule {}