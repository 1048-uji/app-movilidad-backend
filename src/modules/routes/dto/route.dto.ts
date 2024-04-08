import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsAlphanumeric, IsArray, IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsStrongPassword, isNumber } from 'class-validator';
import { Strategy } from './routeOptions.dto';

export class RouteDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    id?: number;
    @ApiProperty()
    @IsString()
    name?: string;
    @ApiPropertyOptional()
    path?: string;
    @ApiProperty()
    @IsString()
    distance: string;
    @ApiProperty()
    @IsString()
    duration: string;
    @ApiProperty()
    @IsString()
    start: string;
    @ApiProperty()
    @IsString()
    end: string;
    @ApiProperty()
    geometry: string;
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    fav?: boolean;
    @ApiProperty()
    @IsEnum(Strategy)
    type: Strategy;
    userId?: number;
}