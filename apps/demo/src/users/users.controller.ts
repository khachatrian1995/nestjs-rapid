import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UsePipes } from '@nestjs/common';
import { EntityExistPipe, EntityUniquePipe } from 'nestjs-rapid';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new EntityUniquePipe(User))
  @Post()
  create(@Body() user: Omit<User, 'id'>): Promise<User> {
    return this.usersService.insert(user);
  }

  @UsePipes(new EntityExistPipe(User))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.findOne({ id: userId });
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UsePipes(new EntityExistPipe(User))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.remove({ id: userId });
  }
}
