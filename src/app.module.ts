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
    type: 'postgres',
    host:'ep-lively-snowflake-84656411.eu-central-1.aws.neon.fl0.io',
    port: 5432,
    username: 'fl0user',
    password: 'Z8yxw9EVKJkf',
    database: 'database',
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
