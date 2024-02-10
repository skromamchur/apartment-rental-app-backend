
import {Injectable } from '@nestjs/common';
import { lastValueFrom} from 'rxjs';
import { map } from 'rxjs/operators';

import {HttpService} from "@nestjs/axios";
import * as process from "process";
import {response} from "express";

@Injectable()
export class GoogleMapsService {
    constructor(private readonly httpService: HttpService) {}

    async getPlaceDetails(placeId: string): Promise<any> {

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=uk`;


        const data = await lastValueFrom(this.httpService.get(url).pipe(
            map(response => response.data.result)
        ))

        const addressComponents = data.address_components;

        if (
          addressComponents.find((el) =>
            el.types.includes('administrative_area_level_1'),
          ) &&
          addressComponents.find(
            (el) =>
              el.types.includes('route') &&
              addressComponents.find((el) => el.types.includes('locality')),
          )
        ) {
          return {
            street: addressComponents.find((el) => el.types.includes('route'))
              .long_name,
            city: addressComponents.find((el) => el.types.includes('locality'))
              .long_name,
            state: addressComponents.find((el) =>
              el.types.includes('administrative_area_level_1'),
            ).long_name,
            ...data.geometry.location
          };
        } else {
          return {
            street: '',
            city: '',
            state: '', ...data.geometry.location
          };
        }
    }

    async getPlaceByCoords({lat, lng}){
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=uk`;

        const data = await lastValueFrom(this.httpService.get(url).pipe(
            map(response => response.data)
        ));

        let result = "";
        let geometry = ""

        if (data.results && data.results.length > 0) {
            for (const resultItem of data.results) {
                const addressComponents = resultItem.address_components;

                let street = "";
                let houseNumber = "";

                for (const component of addressComponents) {
                    if (component.types.includes("route")) {
                        street = component.long_name;
                    } else if (component.types.includes("street_number")) {
                        houseNumber = component.long_name;
                    }
                }

                const city = addressComponents.find(component => component.types.includes("locality"));
                const country = addressComponents.find(component => component.types.includes("country"));

                if (street && houseNumber && city) {
                    geometry = resultItem;
                    result = `${city.long_name}, ${street}, ${houseNumber}`;
                    break;
                }
            }

            if (!result) {
                console.log("No results found with required information");
            }
        } else {
            console.log("No results found");
        }

        return {result, geometry};
    }

}