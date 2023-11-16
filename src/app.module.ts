import { Module } from '@nestjs/common';
import { UserService } from './modules/users/user.service';
import { UserController } from './modules/users/user.controller';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
