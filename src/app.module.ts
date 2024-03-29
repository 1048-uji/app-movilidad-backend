import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceOfInterestModule } from './modules/place-of-interest/place-of-interest.module';
import { PlaceOfInterest } from 'entities/placeOfInterest.entity';
import { User } from 'entities/user.entity';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { Vehicle } from 'entities/vehicle.entity';
import { RoutesModule } from './modules/routes/routes.module';
import { Route } from 'entities/route.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'modules/auth/strategy/jwt.constant';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:'dpg-co3fifi1hbls73f12co0-a.frankfurt-postgres.render.com',
      port: 5432,
      username: 'appmobilidaddb_2gis_user',
      password: 'TPWasYpqk30nWytcdjaSYELUmviCMxoA',
      database: 'appmobilidaddb_2gis',
      entities: [User, PlaceOfInterest, Vehicle, Route],
      synchronize: true,
      ssl: {rejectUnauthorized: false},
    }),
    UsersModule, 
    AuthModule,
    PlaceOfInterestModule,
    VehicleModule,
    RoutesModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
