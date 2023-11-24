// performer.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

@Module({
    imports: [TypeOrmModule.forFeature([TrackEntity])],
    providers: [TrackService]
  })
  
export class TrackModule {}
