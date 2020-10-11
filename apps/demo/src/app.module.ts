import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      database: 'nestjs-rapid-demo-mysql',
      username: 'developer',
      password: 'repoleved',
      autoLoadEntities: true,
      synchronize: true
    }),
    UsersModule,
    AlbumsModule
  ]
})
export class AppModule {}
