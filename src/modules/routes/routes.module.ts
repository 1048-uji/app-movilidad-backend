import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { PlaceOfInterest } from 'entities/placeOfInterest.entity';
import { Vehicle } from 'entities/vehicle.entity';
import { Route } from 'entities/route.entity';
import { JwtStrategy } from 'modules/auth/strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, PlaceOfInterest, Vehicle, Route])],
  controllers: [RoutesController],
  providers: [RoutesService, JwtStrategy]
})
export class RoutesModule {}
