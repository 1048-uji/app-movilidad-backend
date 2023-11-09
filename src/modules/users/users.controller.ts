import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service'
 
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    @Post('/user')
    async registerUser(mail: string, password: string){
        return this.userService.registerUser(mail, password);
    }
}
