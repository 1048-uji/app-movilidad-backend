import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { Vehicle } from '../../entities/vehicle.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Vehicle])],
    controllers: [UserController],
    providers: [UserService, JwtStrategy]
})
export class UsersModule {}