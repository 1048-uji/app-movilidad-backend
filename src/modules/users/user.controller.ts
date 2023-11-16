import { Controller, Delete, Get, Post } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from '../../entities/user.entity';
import { LoginDto } from '../auth/dto/login.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('/login')
    async login(login: LoginDto): Promise<{token: String}>{
        return this.userService.login(login);
    }
    @Delete('/user')
    async deleteAccount(user: User): Promise<User>{
        return this.userService.deleteAccount(user);
    }
}