import { Controller, Post, Body, ValidationPipe, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'entities/user.entity';
import { PasswordDto } from './dto/password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        loginObject: LoginDto
    ): Promise<{ token: string}> {
        return this.authService.login(loginObject);
    }

    @Post('verifyPassword')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('strategy_jwt_1'))
    async verifyPassword(
        @Request() req: any,
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        ) password: PasswordDto
    ): Promise<boolean> {
        return this.authService.verifyPassword(req.user, password);
    }

    @Post('register')
    async register(
        @Body(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true
            })
        )
        registerObject: RegisterDto
    ): Promise<User> {
        return this.authService.register(registerObject);
    }
}

