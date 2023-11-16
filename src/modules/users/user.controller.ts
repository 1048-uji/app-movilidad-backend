import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from '../../entities/user.entity';
 
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Get('/users')
    async getUsers(): Promise<User[]>{
        return this.userService.getUsers();
    }

    @Delete('/user')
    async deleteAccount(user: User): Promise<User>{
        return this.userService.deleteAccount(user);
    }
}