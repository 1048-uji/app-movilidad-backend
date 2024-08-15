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
import 'dotenv/config';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
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
