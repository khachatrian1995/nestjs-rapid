import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>
  ) {}

  create(customer: Omit<Customer, 'id'>): Promise<Customer> {
    return this.customerRepository.save(this.customerRepository.create(customer));
  }

  findOne(customerId: string): Promise<Customer> {
    return this.customerRepository.findOne(customerId);
  }

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }
}
