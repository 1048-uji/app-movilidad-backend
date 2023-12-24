import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { CarbType } from 'entities/vehicle.entity';

export class VehicleDto {

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    id?: number;
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
    @IsEnum(CarbType)
    carbType: CarbType;
    @ApiProperty()
    @IsNumber()
    consum: number;
    @ApiProperty()
    @IsBoolean()
    fav?: boolean;
    userId?: number;
}