import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import axios from 'axios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaceOfinterestDto } from './dto/placeOfInterest.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class PlaceOfInterestService {

  constructor(
    @InjectRepository(PlaceOfInterest) private readonly poiRepository: Repository<PlaceOfInterest>
) {}


  async addPlaceOfInteresToponym(toponym: string, user: User): Promise<PlaceOfInterest> {
    const API_KEY = '5b3ce3597851110001cf62482f02da5ed6794ccc8c6774ab019ffc8d';
    
    try {
      const response = await axios.get('https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(toponym)')

      // Verificar si la solicitud fue exitosa y obtener las coordenadas
      if (response.status === 200 && response.data && response.data.features && response.data.features.length > 0) {
        const coordinates = response.data.features[0].geometry.coordinates;
        const longitude = coordinates[0].toString(); // Longitud
        const latitude = coordinates[1].toString(); // Latitud
        
        const poiExist = await this.poiRepository.findOneBy({
          lat: latitude,
          lon: longitude,
        });

      if (poiExist) {
        throw new HttpException('Place of Interest already exists', HttpStatus.CONFLICT);
      }
      
      const poi:  PlaceOfinterestDto = {
        name: toponym,
        lon: longitude,
        lat: latitude,
        fav: false,
        userId: user.id
      }
      return this.poiRepository.save(poi);

      } else {
        throw new Error('No se encontraron coordenadas para el lugar especificado.');
      }
    } catch (error) {
      throw new Error('Exception');
    }
  }

  async clearDatabase(): Promise<void> {
    this.poiRepository.clear();
  }

  async getPlacesOfInterest(): Promise<PlaceOfInterest[]> {
    return this.poiRepository.find();
  }
}
