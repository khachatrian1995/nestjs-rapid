import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { EntityExistPipe } from 'nestjs-rapid';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() customer: Omit<Customer, 'id'>): Promise<Customer> {
    return this.customersService.create(customer);
  }

  @UsePipes(new EntityExistPipe(Customer))
  @Get(':id')
  findOne(@Param('id') customerId: string): Promise<Customer> {
    return this.customersService.findOne(customerId);
  }

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }
}
