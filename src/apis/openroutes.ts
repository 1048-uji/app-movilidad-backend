import axios from 'axios';
import { PlaceOfinterestDto } from '../modules/place-of-interest/dto/placeOfInterest.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RouteDto } from '../modules/routes/dto/route.dto';
import { RouteOptionsDto, Strategy } from '../modules/routes/dto/routeOptions.dto';
import { RouteStrategy } from '../modules/routes/strategies/interface/route-strategy.interface';
import { FastRouteStrategy } from '../modules/routes/strategies/fast-route.strategy';
import { ShortRouteStrategy } from '../modules/routes/strategies/short-route.strategy';
import { RecommendedRouteStrategy } from '../modules/routes/strategies/recommended-route.strategy';

class OpenRoutesService {
  private static instance: OpenRoutesService;
  private baseUrl: string = 'https://api.openrouteservice.org/';
  private apiKey: string = process.env.OPENROUTE_API_KEY;

  private constructor() {}

  public static getInstance(): OpenRoutesService {
    if (!OpenRoutesService.instance) {
        OpenRoutesService.instance = new OpenRoutesService();
    }

    return OpenRoutesService.instance;
  }

  async getCoordinatesByAddress(placeOfInterstData: PlaceOfinterestDto): Promise<PlaceOfinterestDto> {
    try {
        const geocodingResponse = await axios.get(this.baseUrl+'geocode/search', {
          headers: {
            'Accept-Language': 'name=Spanish, iso6391=es, iso6393=spa'
          },
          params: {
              api_key: this.apiKey,
              text: placeOfInterstData.address,
          },
        });
        if (geocodingResponse.status === 200 && geocodingResponse.data && geocodingResponse.data.features && geocodingResponse.data.features.length > 0) {
          const coordinates = geocodingResponse.data.features[0].geometry.coordinates;
          const longitude = coordinates[0].toString(); // Longitud
          const latitude = coordinates[1].toString(); // Latitud
        
        const poi:  PlaceOfinterestDto = {
          name: placeOfInterstData.name,
          lon: longitude,
          lat: latitude,
          address: placeOfInterstData.address,
          country: geocodingResponse.data.features[0].properties.country,
          macroregion: geocodingResponse.data.features[0].properties.macroregion,
          region: geocodingResponse.data.features[0].properties.region,
          localadmin: geocodingResponse.data.features[0].properties.localadmin,
          fav: false,
        }
        return poi;

        } else {
          throw new HttpException('No se encontraron coordenadas para el lugar especificado.', HttpStatus.NOT_FOUND);
        }
    } catch (error) {
      throw new HttpException('API Failed', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAddressByCoordinates(placeOfInterestdata: PlaceOfinterestDto): Promise<PlaceOfinterestDto> {
    try {
      const geocodingResponse = await axios.get(this.baseUrl+"geocode/reverse", {
        headers: {
          'Accept-Language': 'name=Spanish, iso6391=es, iso6393=spa'
        },
        params: {
          api_key: this.apiKey,
          'point.lon': placeOfInterestdata.lon,
          'point.lat': placeOfInterestdata.lat,
        },
      });
      if (geocodingResponse.status === 200 && geocodingResponse.data && geocodingResponse.data.features && geocodingResponse.data.features.length > 0) {
        placeOfInterestdata.address = geocodingResponse.data.features[0].properties.label;
        placeOfInterestdata.country = geocodingResponse.data.features[0].properties.country;
        placeOfInterestdata.macroregion = geocodingResponse.data.features[0].properties.macroregion;
        placeOfInterestdata.region = geocodingResponse.data.features[0].properties.region;
        placeOfInterestdata.localadmin = geocodingResponse.data.features[0].properties.localadmin;
        return placeOfInterestdata
      } else {
      throw new HttpException('No se encontraron coordenadas para el lugar especificado.', HttpStatus.NOT_FOUND);
    }
      
    } catch (error) {
      throw new HttpException('APIFailed', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async createRoute(start: PlaceOfinterestDto, end: PlaceOfinterestDto, routeOptions: RouteOptionsDto): Promise<RouteDto>{
    let route: RouteStrategy
    switch(routeOptions.strategy) { 
      case Strategy.FAST: { 
         route = new FastRouteStrategy() 
         break; 
      } 
      case Strategy.SHORT: { 
        route = new ShortRouteStrategy()
         break; 
      } 
      case Strategy.RECOMMENDED: { 
        route = new RecommendedRouteStrategy()
        break; 
      }
    } 
    return route.createRoute(start, end, routeOptions)
  }
}

export default OpenRoutesService;