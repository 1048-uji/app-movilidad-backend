import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host:'roundhouse.proxy.rlwy.net',
    port: 26383,
    username: 'root',
    password: 'EFA4E3ehDbc-3BAb5DFFHHbf6feH5HH5',
    database: 'railway',
    entities: [__dirname + '/**/*.entity[.ts,.js]'],
    synchronize: true,
  }),
    UsersModule, 
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
