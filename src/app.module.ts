import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';
import { UsersController } from './modules/users/users.controller';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
