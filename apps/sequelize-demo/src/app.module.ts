import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      database: 'nestjs-rapid-sequelize-demo-mysql',
      username: 'developer',
      password: 'repoleved',
      autoLoadModels: true,
      synchronize: true
    }),
    UsersModule
  ]
})
export class AppModule {}
