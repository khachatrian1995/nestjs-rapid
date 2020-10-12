import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOrderDto } from './find-order.dto';
import { Order } from './order.entity';

export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  create(order: Partial<Order>): Promise<Order> {
    return this.orderRepository.save(this.orderRepository.create(order));
  }

  findOne(findOrderDto: FindOrderDto): Promise<Order> {
    return this.orderRepository.findOne({
      customer: {
        id: findOrderDto.customerId
      },
      product: {
        id: findOrderDto.productId
      }
    });
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }
}
