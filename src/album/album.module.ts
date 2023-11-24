import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([AlbumEntity])],
    providers: [AlbumService]
  })
  
export class AlbumModule {}
