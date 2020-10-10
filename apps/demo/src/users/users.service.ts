import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  insert(album: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.save(this.userRepository.create(album));
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(primary: DeepPartial<User>): Promise<User> {
    return this.userRepository.findOne(primary);
  }

  async remove(primary: DeepPartial<User>): Promise<User> {
    return this.userRepository.remove(await this.userRepository.findOne(primary));
  }
}
