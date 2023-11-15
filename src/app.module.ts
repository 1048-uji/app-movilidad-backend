import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/user.module';
import { UserService } from './modules/users/user.service';
import { UserController } from './modules/users/user.controller';

@Module({
  imports: [UsersModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
