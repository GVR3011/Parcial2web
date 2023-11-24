import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { PerformerModule } from './performer/performer.module';
import { TrackModule } from './track/track.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerEntity } from './performer/performer.entity';
import { TrackEntity } from './track/track.entity';
import { AlbumEntity } from './album/album.entity';
import { PerformerAlbumModule } from './performer-album/performer-album.module';

@Module({
  imports: [PerformerModule, TrackModule, AlbumModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'museum',
    entities: [PerformerEntity, TrackEntity, AlbumEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }),
  PerformerAlbumModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
