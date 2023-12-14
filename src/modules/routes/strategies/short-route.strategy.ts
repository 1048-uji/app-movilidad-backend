import axios from 'axios';
import { RouteStrategy } from './interface/route-strategy.interface';
import { PlaceOfinterestDto } from 'modules/place-of-interest/dto/placeOfInterest.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RouteDto } from '../dto/route.dto';
import { RouteOptionsDto } from '../dto/routeOptions.dto';

export class ShortRouteStrategy implements RouteStrategy {
  private baseUrl: string = 'https://api.openrouteservice.org/';
  private apiKey: string = process.env.OPENROUTE_API_KEY;
  async createRoute(start: PlaceOfinterestDto, end: PlaceOfinterestDto, type: RouteOptionsDto): Promise<RouteDto> {
    const response = await axios.post(this.baseUrl+'v2/directions/'+type.vehicleType+'/geojson', {
      coordinates: [[start.lon, start.lat],[end.lon,end.lat]],
      preference: 'shortest',
      language: 'es',
    }, {
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': this.apiKey,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    if (response.status === 200 && response.data && response.data.features && response.data.features.length > 0) {
        const route: RouteDto = {
          path: response.data.features[0].properties.segments[0].steps.map((step) => ({
            distance: step.distance,
            instruction: step.instruction,
          })),
          distance: response.data.features[0].properties.summary.distance,
          duration: response.data.features[0].properties.summary.duration,
          start: start.lon+','+start.lat,
          end: end.lon+','+end.lat,
          geometry: response.data.features[0].geometry,
          type: 'shortest'
      }
        return route;
      } else {
        throw new HttpException('No se pudo crear la ruta específica', HttpStatus.NOT_FOUND);
      }
  }
}