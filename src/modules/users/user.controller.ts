import { Controller, Post, Get } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from 'src/entities/placeOfInterest';
 
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('/user')
    async registerUser(user: User){
        return this.userService.registerUser(user);
    }

    @Post('/places-of-interest')
    async addPlaceOfInterest(user: User, place: PlaceOfInterest) {
        return this.userService.addPlaceOfInterest(user, place);
    }

    @Get('/places-of-interest')
    async getPlacesOfInterest(user: User) {
        return this.userService.getPlacesOfInterest(user);
    }
}
