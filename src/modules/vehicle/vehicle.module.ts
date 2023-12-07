import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Vehicle } from 'entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Vehicle])],
  controllers: [VehicleController],
  providers: [VehicleService]
})
export class VehicleModule {}
