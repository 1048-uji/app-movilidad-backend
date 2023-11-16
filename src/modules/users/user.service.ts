import { Injectable } from '@nestjs/common';
import { LoginDto } from '../auth/dto/login.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {

    async registerUser(user: User): Promise<User>{
        return null;
    }

    async login(login: LoginDto):Promise<{token: String}>{
        return null;
    }

    async logout(user: User){
        return null;
    }

    async getAuthenticatedUsers(): Promise<User[]>{
        return null;
    }

    async clearDatabase(){
        return null;
    }
}