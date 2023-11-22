import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from './strategy/jwt.constant';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '30d' },
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}