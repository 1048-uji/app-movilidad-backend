import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from 'src/entities/placeOfInterest';

@Injectable()
export class UserService {
    async registerUser(user: User) {}

    async addPlaceOfInterest(user: User, place: PlaceOfInterest) {}

    async getPlacesOfInterest(user: User) {}

    async clearDatabase() {}
}
