import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    async verifyToken({token: String}){
        return null;
    }
}
