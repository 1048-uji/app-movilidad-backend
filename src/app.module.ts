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

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: 'postgres',
    host:'dpg-clnkjt8apebc739qh7e0-a',
    port: 5432,
    username: 'root',
    password: 'VVpDybcUWbrDFJ89SjvLWy0xn0W0i2PM',
    database: 'appmobilidaddb',
    entities: [User, PlaceOfInterest, Vehicle, Route],
    synchronize: true,
    ssl: {rejectUnauthorized: false},
  }),
    UsersModule, 
    AuthModule,
    PlaceOfInterestModule,
    VehicleModule,
    RoutesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
