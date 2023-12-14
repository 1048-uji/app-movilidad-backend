import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class PlaceOfinterestDto {

    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    lon?: string;
    @ApiProperty()
    @IsString()
    lat?: string;
    @ApiProperty()
    @IsString()
    address?: string;
    @ApiProperty()
    @IsBoolean()
    fav?: boolean;
    userId?: number;
}