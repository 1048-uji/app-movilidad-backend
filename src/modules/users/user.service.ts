import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

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
