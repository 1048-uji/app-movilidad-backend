import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
    async registerUser(user: User): Promise<User>{
        return null;
    }
    async getUsers(): Promise<User[]>{
        return null;
    }

    async clearDatabase(){
        return null;
    }
}
