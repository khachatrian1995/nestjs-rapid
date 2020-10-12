import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

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
    CustomersModule,
    ManufacturersModule,
    OrdersModule,
    ProductsModule
  ]
})
export class AppModule {}
