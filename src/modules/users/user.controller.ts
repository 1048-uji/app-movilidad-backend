import { Controller, Delete, Get, Param, ParseIntPipe, Request, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from '../../entities/user.entity';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
 
@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Get('/users')
    async getUsers(): Promise<User[]>{
        return this.userService.getUsers();
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: Number })
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async deleteAccount(@Request() req: any,
    @Param('id', ParseIntPipe) id: number): Promise<String> {
    const user = req.user;
    if (user.id !== id) {
        throw new HttpException('InvalidUserException', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.deleteAccount(id);
}
}