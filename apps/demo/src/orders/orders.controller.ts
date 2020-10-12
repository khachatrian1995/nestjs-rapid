import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { EntityUniquePipe, RelationExistPipe } from 'nestjs-rapid';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { Customer } from '../customers/customer.entity';
import { Product } from '../products/product.entity';
import { FindOrderDto } from './find-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UsePipes(
    new RelationExistPipe(Customer, (order: Order) => order.customer),
    new RelationExistPipe(Product, (order: Order) => order.product),
    new EntityUniquePipe(Order)
  )
  @Post()
  create(@Body() order: Partial<Order>): Promise<Order> {
    return this.ordersService.create(order);
  }

  @Get()
  findOne(@Query() findOrderDto: FindOrderDto): Promise<Order> {
    return this.ordersService.findOne(findOrderDto);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
}
