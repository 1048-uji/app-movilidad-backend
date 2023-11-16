import { Controller, Get, Post } from '@nestjs/common';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';

@Controller('place-of-interest')
export class PlaceOfInterestController {
  constructor(private poiService: PlaceOfInterestService) {}

  @Post('/place-of-interest')
  async addPlaceOfInterestCoords(coords: string): Promise<PlaceOfInterest> {
    return this.poiService.addPlaceOfInterestCoords(coords);
  }
}
