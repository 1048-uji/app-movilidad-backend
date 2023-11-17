import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class PlaceOfInterestService {
  private placesOfInterest: PlaceOfInterest[] = [];

  async addPlaceOfInterest(toponym: String): Promise<PlaceOfInterest> {
    return null;
  }

  async getCoordinatesFromAPI(location: string): Promise<string> {
    return null;
  }

  async savePointOfInterest(place: PlaceOfInterest): Promise<PlaceOfInterest> {
    return null;
  }

  async getAllPointsOfInterest(): Promise<PlaceOfInterest[]> {
    return null;
  }

  async clearPointsOfInterest(): Promise<void> {
    return null;
  }
}
