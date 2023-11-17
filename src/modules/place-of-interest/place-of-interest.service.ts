import { Injectable } from '@nestjs/common';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';

@Injectable()
export class PlaceOfInterestService {
  private placesOfInterest: PlaceOfInterest[] = [];
  
  async addPlaceOfInterest(place: PlaceOfInterest): Promise<PlaceOfInterest> {
    if (this.checkPlace(place)) {
      return null;
    }
  }

  async getPlacesOfInterest(): Promise<PlaceOfInterest[]> {
    return null;
  }

  private async checkPlace(place: PlaceOfInterest): Promise<Boolean> {
    return null;
  }

  async clearPointsOfInterest() {}
}