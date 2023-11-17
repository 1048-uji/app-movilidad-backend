import { Controller, Post, Get } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from 'src/entities/placeOfInterest.entity';
 
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('/user')
    async registerUser(user: User){
        return this.userService.registerUser(user);
    }
}
