import { Controller, Get, Post } from '@nestjs/common';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';

@Controller('place-of-interest')
export class PlaceOfInterestController {
    constructor(private piService: PlaceOfInterestService) {}

    @Get('/places-of-interest')
    async getPlacesOfInterest(): Promise<PlaceOfInterest[]> {
        return this.piService.getPlacesOfInterest();
    }
}
