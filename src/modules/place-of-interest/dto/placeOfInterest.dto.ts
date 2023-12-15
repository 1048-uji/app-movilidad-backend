import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class PlaceOfinterestDto {

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    id?: number;
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
    region?: string;
    @ApiProperty()
    @IsString()
    macroregion?: string;
    @ApiProperty()
    @IsString()
    localadmin?: string;
    @ApiProperty()
    @IsString()
    country?: string;
    @ApiProperty()
    @IsString()
    address?: string;
    @ApiProperty()
    @IsBoolean()
    fav?: boolean;
    userId?: number;
}