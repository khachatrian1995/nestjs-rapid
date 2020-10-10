import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Album } from './album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>
  ) {}

  insert(album: Omit<Album, 'id'>): Promise<Album> {
    return this.albumRepository.save(this.albumRepository.create(album));
  }

  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  findOne(primary: DeepPartial<Album>): Promise<Album> {
    return this.albumRepository.findOne(primary);
  }

  async remove(primary: DeepPartial<Album>): Promise<Album> {
    return this.albumRepository.remove(await this.albumRepository.findOne(primary));
  }
}
