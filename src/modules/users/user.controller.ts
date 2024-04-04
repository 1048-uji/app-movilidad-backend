import { Controller, Delete, Get, Param, ParseIntPipe, Request, Post, UseGuards, HttpException, HttpStatus, Put, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from '../../entities/user.entity';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
 
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
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async deleteAccount(@Request() req: any,
    @Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
        const user = req.user;
        if (user.id !== id) {
            throw new HttpException('InvalidUserException', HttpStatus.UNAUTHORIZED);
        }
        return this.userService.deleteAccount(id);
    }

    @Put()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async updateUser(
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        userData: UserDto,
        @Request() req: any
    ): Promise<User> {
        return this.userService.updateUser(userData, req.user);
    }
}