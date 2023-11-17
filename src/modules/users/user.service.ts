import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { PlaceOfInterest } from 'src/entities/placeOfInterest.entity';

@Injectable()
export class UserService {
    async registerUser(user: User): Promise<User>{
        return null
    }

    async getUsers(): Promise<User[]>{
        return null
    }

    async clearDatabase() {}
}
