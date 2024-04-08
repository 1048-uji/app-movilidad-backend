import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { CarbType } from 'entities/vehicle.entity';

export enum Strategy {
  FAST = 'fast',
  RECOMMENDED = 'recommended',
  SHORT = 'short',
}

export enum VehicleType {
  DRIVING_CAR = 'driving-car',
  DRIVING_HGV = 'driving-hgv',
  CYCLING_REGULAR = 'cycling-regular',
  CYCLING_ROAD = 'cycling-road',
  CYCLING_MOUNTAIN = 'cycling-mountain',
  CYCLING_ELECTRIC = 'cycling-electric',
  FOOT_WALK = 'foot-walking',
  FOOT_HIKING = 'foot-hiking',
  WHEELCHAIR = 'wheelchair',
}

export class RouteOptionsDto {

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startLon?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startLat?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Validate(addressValidator)
  startAddress?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endLon?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endLat?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Validate(addressValidator)
  endAddress?: string;
  @ApiPropertyOptional()
  @IsEnum(Strategy)
  strategy: Strategy;
  @ApiProperty()
  @IsEnum(VehicleType)
  vehicleType: VehicleType;
}

function addressValidator(address: string) {
  // Eliminar los apostrofes del campo address
  return address.replace(/'/g, '');
}