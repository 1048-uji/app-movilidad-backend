import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from 'src/entities/user.entity';
 
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('/user')
    async registerUser(user: User): Promise<User>{
        return this.userService.registerUser(user);
    }

    @Get('/users')
    async getUsers(): Promise<User[]>{
        return this.userService.getUsers();
    }
}
