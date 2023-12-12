import axios from 'axios';
import { PlaceOfinterestDto } from 'modules/place-of-interest/dto/placeOfInterest.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

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

  async getCoordinatesByAddress(toponym: string): Promise<PlaceOfinterestDto> {
    try {
        const geocodingResponse = await axios.get(this.baseUrl+'geocode/search', {
          params: {
              api_key: this.apiKey,
              text: toponym,
          },
        });
        if (geocodingResponse.status === 200 && geocodingResponse.data && geocodingResponse.data.features && geocodingResponse.data.features.length > 0) {
          const coordinates = geocodingResponse.data.features[0].geometry.coordinates;
          const longitude = coordinates[0].toString(); // Longitud
          const latitude = coordinates[1].toString(); // Latitud
        
        const poi:  PlaceOfinterestDto = {
          name: toponym,
          lon: longitude,
          lat: latitude,
          address: toponym,
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
        params: {
          api_key: this.apiKey,
          'point.lon': placeOfInterestdata.lon,
          'point.lat': placeOfInterestdata.lat,
        },
      });
      if (geocodingResponse.status === 200 && geocodingResponse.data && geocodingResponse.data.features && geocodingResponse.data.features.length > 0) {
        placeOfInterestdata.address = geocodingResponse.data.features[0].properties.label;
        return placeOfInterestdata
      } else {
      throw new HttpException('No se encontraron coordenadas para el lugar especificado.', HttpStatus.NOT_FOUND);
    }
      
    } catch (error) {
      throw new HttpException('APIFailed', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}

export default OpenRoutesService;