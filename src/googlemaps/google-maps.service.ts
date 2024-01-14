// google-maps.service.ts

import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {catchError, lastValueFrom, Observable} from 'rxjs';
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
          };
        } else {
          return {
            street: '',
            city: '',
            state: '',
          };
        }
    }
}