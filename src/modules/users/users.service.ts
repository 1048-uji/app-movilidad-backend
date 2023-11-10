import { Injectable } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class UsersService {
    async registerUser(mail: string, password: string): Promise<Users>{
        return null;
    }
}
