import { Controller, Get, Post } from '@nestjs/common';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';

@Controller('place-of-interest')
export class PlaceOfInterestController {
    constructor(private piService: PlaceOfInterestService) {}

    @Post('/place-of-interest')
    async addPlaceOfInterest(place: PlaceOfInterest): Promise<PlaceOfInterest> {
        return this.piService.addPlaceOfInterest(place);
    }

    @Get('/places-of-interest')
    async getPlacesOfInterest(): Promise<PlaceOfInterest[]> {
        return this.piService.getPlacesOfInterest();
    }
}
