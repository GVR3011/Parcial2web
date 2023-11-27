import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TrackDto } from './track.dto';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

@Controller('tracks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
    
    constructor(private readonly tarckService: TrackService) {}

    @Get()
    async findAll() {
      return await this.tarckService.findAll();
    }

    @Get(':trackId')
    async findOne(@Param('trackId') trackId: string) {
      return await this.tarckService.findOne(trackId);
    }

    @Post()
    async create(@Body() trackDto: TrackDto) {
      const track: TrackEntity = plainToInstance(TrackEntity, trackDto);
      return await this.tarckService.create(track);
    }
}