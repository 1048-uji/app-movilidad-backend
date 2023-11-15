import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/place-of-interest.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class PlaceOfInterestService {
  private placesOfInterest: PlaceOfInterest[] = [];

  async addPlaceOfInterest(place: PlaceOfInterest): Promise<PlaceOfInterest> {
    // Verificar si el lugar de interés ya existe
    const existingPlace = this.placesOfInterest.find(p => p.name === place.name);
    if (existingPlace) {
      throw new HttpException('El lugar de interés ya existe', HttpStatus.BAD_REQUEST);
    }

    // Agregar el lugar de interés a la lista
    this.placesOfInterest.push(place);
    return place;
  }

  async getAllPlacesOfInterest(): Promise<PlaceOfInterest[]> {
    return this.placesOfInterest;
  }

  async clearDatabase() {
    // Limpiar la lista de lugares de interés (simulación)
    this.placesOfInterest = [];
  }
}
