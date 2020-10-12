import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from './manufacturer.entity';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>
  ) {}

  create(manufacturer: Omit<Manufacturer, 'id' | 'products'>): Promise<Manufacturer> {
    return this.manufacturerRepository.save(this.manufacturerRepository.create(manufacturer));
  }

  findOne(manufacturerId: string): Promise<Manufacturer> {
    return this.manufacturerRepository.findOne(manufacturerId);
  }

  findAll(): Promise<Manufacturer[]> {
    return this.manufacturerRepository.find();
  }
}
