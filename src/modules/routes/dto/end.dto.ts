import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword, Validate } from 'class-validator';

export class EndDto {

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    id?: number;
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lon?: string;
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lat?: string;
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    region?: string;
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    macroregion?: string;
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    localadmin?: string;
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    country?: string;
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @Validate(addressValidator)
    address?: string;
    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    fav?: boolean;
    userId?: number;
}

function addressValidator(address: string) {
    // Eliminar los apostrofes del campo address
    return address.replace(/'/g, '');
  }