import { Module } from '@nestjs/common';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { User } from 'entities/user.entity';
import { PlaceOfInterest } from 'entities/placeOfInterest.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, PlaceOfInterest])],
  controllers: [PlaceOfInterestController],
  providers: [PlaceOfInterestService, JwtStrategy]
})
export class PlaceOfInterestModule {}
