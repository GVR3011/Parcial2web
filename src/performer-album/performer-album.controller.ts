import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PerformerAlbumService } from './performer-album.service';

@Controller('performers-albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerAlbumController {
    constructor(private readonly performerAlbumService: PerformerAlbumService){}

    @Post(':albumId/performers/:performerId')
    async addPerformerToAlbum(@Param('albumId') albumId: string, @Param('performerId') performerId: string){
       return await this.performerAlbumService.addPerformerToAlbum(albumId, performerId);
   }
}