import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class VehicleDto {

    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    registration: string;
    @ApiProperty()
    @IsString()
    brand: string;
    @ApiProperty()
    @IsString()
    model?: string;
    @ApiProperty()
    @IsString()
    carbType: string;
    @ApiProperty()
    @IsNumber()
    consum: number;
    @ApiProperty()
    @IsBoolean()
    fav: boolean;
    userId?: number;
}