import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Vehicle } from 'entities/vehicle.entity';
import { JwtStrategy } from 'modules/auth/strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Vehicle])],
  controllers: [VehicleController],
  providers: [VehicleService, JwtStrategy]
})
export class VehicleModule {}
