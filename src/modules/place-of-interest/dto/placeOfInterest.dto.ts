import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class PlaceOfinterestDto {

    @IsString()
    name: string;
    @IsString()
    lon: string;
    @IsString()
    lat: string;
    @IsBoolean()
    fav: boolean;
    userId: number;
}