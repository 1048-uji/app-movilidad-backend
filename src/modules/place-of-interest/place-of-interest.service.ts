import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class PlaceOfInterestService {
  private placesOfInterest: PlaceOfInterest[] = [];

  async addPlaceOfInterestCoords(Cords: String): Promise<PlaceOfInterest> {
    return null;
  }

  async getPlacesOfInterest(): Promise<PlaceOfInterest[]> {
    return null;
  }

  async clearDatabase(){
    return null;
  }
}