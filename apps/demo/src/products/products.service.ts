import { UsePipes } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityExistPipe, EntityUniquePipe, RelationExistPipe } from 'nestjs-rapid';
import { Product } from './product.entity';
import { Manufacturer } from '../manufacturers/manufacturer.entity';

export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  @UsePipes(
    new RelationExistPipe(Manufacturer, (product: Product) => product.manufacturer),
    new EntityUniquePipe(Product)
  )
  create(product: Omit<Product, 'id'>): Promise<Product> {
    return this.productRepository.save(this.productRepository.create(product));
  }

  @UsePipes(new EntityExistPipe(Product))
  findOne(productId: string): Promise<Product> {
    return this.productRepository.findOne(productId);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
