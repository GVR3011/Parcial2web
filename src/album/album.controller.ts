import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AlbumService } from './album.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { AlbumDto } from './album.dto';
import { AlbumEntity } from './album.entity';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}

    @Get()
    async findAll() {
      return await this.albumService.findAll();
    }

    @Get(':albumId')
    async findOne(@Param('albumId') albumId: string) {
      return await this.albumService.findOne(albumId);
    }

    @Post()
    async create(@Body() albumDto: AlbumDto) {
      const museum: AlbumEntity = plainToInstance(AlbumEntity, albumDto);
      return await this.albumService.create(museum);
    }

    @Delete(':albumId')
    @HttpCode(204)
    async delete(@Param('albumId') albumId: string) {
      return await this.albumService.delete(albumId);
    }
}