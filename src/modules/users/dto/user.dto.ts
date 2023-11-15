import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UserDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    mail: string;

    @ApiProperty()
    @IsString()
    @IsStrongPassword()
    password: string;
}