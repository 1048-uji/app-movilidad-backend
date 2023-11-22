import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceOfInterestController } from './place-of-interest.controller';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterest } from '../../entities/placeOfInterest.entity';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { User } from '../../entities/user.entity';


@Module({

    imports: [TypeOrmModule.forFeature([PlaceOfInterest])],
    controllers: [PlaceOfInterestController],
    providers: [PlaceOfInterestService, JwtStrategy ]
})

    export class PlaceOfInterestModule { }
