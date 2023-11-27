import { Injectable } from '@nestjs/common';
import { TrackEntity } from './track.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>
    ){}

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: ["album"] });
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({where: {id}} );
        if (!track)
          throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
   
        return track;
    }

    async create(track: TrackEntity): Promise<TrackEntity> {
        if (track.duracion <= 0)
          throw new BusinessLogicException("The track duration must be positive", BusinessError.NOT_FOUND);
        return await this.trackRepository.save(track);
    }
}