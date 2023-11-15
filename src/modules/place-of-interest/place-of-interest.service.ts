import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../place-of-interest/';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class PlaceOfInterestService {
  private placesOfInterest: PlaceOfInterest[] = [];

  async addPlaceOfInterest(place: PlaceOfInterest): Promise<PlaceOfInterest> {
    return null;
  }
}
