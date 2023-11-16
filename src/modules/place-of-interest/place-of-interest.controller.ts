import { Controller, Get, Post } from '@nestjs/common';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';

@Controller('place-of-interest')
export class PlaceOfInterestController {
  constructor(private poiService: PlaceOfInterestService) {}

  @Post('/place-of-interest')
  async addPlaceOfInterest(toponym: string): Promise<PlaceOfInterest> {
    // Implementar la lógica para agregar un lugar de interés
    const coordinates = await this.fetchCoordinates(toponym); // Función para obtener las coordenadas del topónimo

    const newPlaceOfInterest: PlaceOfInterest = {
      id: 0,
      name: toponym,
      coord: coordinates,
      fav: false,
    };

    return this.poiService.addPlaceOfInterest(newPlaceOfInterest);
  }

  // Método ficticio para obtener las coordenadas del topónimo (simulación de una llamada a la API de geocoding)
  private async fetchCoordinates(toponym: string): Promise<string> {
    // Código para obtener las coordenadas del topónimo de una API de geocoding (simulado)
    // Aquí se implementaría la lógica para obtener las coordenadas reales del topónimo
    return '-0.0576800, 39.9929000'; // Coordenadas simuladas
  }
}