import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceOfInterestModule } from './modules/place-of-interest/place-of-interest.module';
import { PlaceOfInterest } from 'entities/placeOfInterest.entity';
import { User } from 'entities/user.entity';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host:'roundhouse.proxy.rlwy.net',
    port: 26383,
    username: 'root',
    password: 'EFA4E3ehDbc-3BAb5DFFHHbf6feH5HH5',
    database: 'railway',
    entities: [User, PlaceOfInterest],
    synchronize: true,
  }),
    UsersModule, 
    AuthModule,
    PlaceOfInterestModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
