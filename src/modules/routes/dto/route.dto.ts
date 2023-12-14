import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword, isNumber } from 'class-validator';

export class RouteDto {

    @ApiProperty()
    @IsNumber()
    id?: number;
    @ApiProperty()
    @IsString()
    name?: string;
    @ApiProperty()
    @IsString()
    path: string;
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
    @IsString()
    geometry: string;
    @ApiProperty()
    @IsBoolean()
    fav?: boolean;
    @ApiProperty()
    @IsString()
    type: string;
    userId?: number;
}