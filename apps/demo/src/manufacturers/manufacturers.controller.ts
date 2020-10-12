import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { EntityExistPipe, EntityUniquePipe } from 'nestjs-rapid';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer } from './manufacturer.entity';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @UsePipes(new EntityUniquePipe(Manufacturer))
  @Post()
  create(@Body() manufacturer: Omit<Manufacturer, 'id' | 'products'>): Promise<Manufacturer> {
    return this.manufacturersService.create(manufacturer);
  }

  @UsePipes(new EntityExistPipe(Manufacturer))
  @Get(':id')
  findOne(@Param('id') manufacturerId: string): Promise<Manufacturer> {
    return this.manufacturersService.findOne(manufacturerId);
  }

  @Get()
  findAll(): Promise<Manufacturer[]> {
    return this.manufacturersService.findAll();
  }
}
