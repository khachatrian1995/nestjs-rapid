import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { EntityExistPipe, EntityUniquePipe, RelationExistPipe } from 'nestjs-rapid';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Manufacturer } from '../manufacturers/manufacturer.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UsePipes(
    new RelationExistPipe(Manufacturer, (product: Product) => product.manufacturer),
    new EntityUniquePipe(Product)
  )
  @Post()
  create(@Body() product: Omit<Product, 'id'>): Promise<Product> {
    return this.productsService.create(product);
  }

  @UsePipes(new EntityExistPipe(Product))
  @Get(':id')
  findOne(@Param('id') productId: string): Promise<Product> {
    return this.productsService.findOne(productId);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }
}
