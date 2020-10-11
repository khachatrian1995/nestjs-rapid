import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UsePipes } from '@nestjs/common';
import { EntityExistPipe, EntityUniquePipe } from 'nestjs-rapid';
import { AlbumsService } from './albums.service';
import { Album } from './album.entity';
import { RelationExistPipe } from 'nestjs-rapid/pipes/relation-exist.pipe';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @UsePipes(new RelationExistPipe(Album, 'user'), new EntityUniquePipe(Album))
  @Post()
  create(@Body() album: Omit<Album, 'id'>): Promise<Album> {
    return this.albumsService.insert(album);
  }

  @UsePipes(new EntityExistPipe(Album))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) albumId: number): Promise<Album> {
    return this.albumsService.findOne({ id: albumId });
  }

  @Get()
  findAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @UsePipes(new EntityExistPipe(Album))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) albumId: number): Promise<Album> {
    return this.albumsService.remove({ id: albumId });
  }
}
