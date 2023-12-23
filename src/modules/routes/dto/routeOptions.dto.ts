import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

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
  @ApiProperty({ enum: Strategy })
  @IsEnum(Strategy)
  strategy?: Strategy;

  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;
}