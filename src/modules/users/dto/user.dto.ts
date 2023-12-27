import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { Vehicle } from '../../../entities/vehicle.entity';
import { Strategy } from '../../routes/dto/routeOptions.dto';

export class UserDto {

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    id?: number;
    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsOptional()
    email: string;
    @ApiProperty()
    @IsString()
    @IsOptional()
    username: string;
    @ApiProperty()
    @IsString()
    @IsStrongPassword()
    @IsOptional()
    password: string;
    @ApiProperty()
    @IsString()
    @IsEnum(Strategy)
    @IsOptional()
    routeDefault?: Strategy;
    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    vehicleDefaultId?: number;

    vehicleDefault?: Vehicle
}