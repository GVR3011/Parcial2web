import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { faker } from '@faker-js/faker';

describe('TrackService', () => {
  let service: TrackService; 
  let repository: Repository<TrackEntity>
  let tracksList: TrackEntity[];
  let albumRepository: Repository<AlbumEntity>;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tracksList = [];
    for (let i = 0; i < 10; i++) {
      const track : TrackEntity = await repository.save({
        nombre: faker.name.firstName(),
        duracion: parseInt(faker.random.numeric(5)),
      });
      tracksList.push(track);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new track', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.name.firstName(),
      caratula: faker.lorem.sentence(),
      fecha: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }
    await albumRepository.save(album)
    const track: TrackEntity = {
      id: "",
      nombre: faker.music.songName(),
      duracion: parseInt(faker.random.numeric(5)),
      album: album
    }
    const newTrack: TrackEntity = await service.create(track);
    expect(newTrack).toBeDefined(); 

    const storedTrack: TrackEntity = await repository.findOne({where: {id: newTrack.id}, relations: ['album'], });
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.nombre).toEqual(track.nombre);
    expect(storedTrack.duracion).toEqual(track.duracion);

  });


  it('create a track without album should thrown exception', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.name.firstName(),
      caratula: faker.lorem.sentence(),
      fecha: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }
    await albumRepository.save(album)
    const track: TrackEntity = {
      id: "",
      nombre: faker.music.songName(),
      duracion: -2938,
      album: album
    }
    await expect(() => service.create(track)).rejects.toHaveProperty('message', 'The track duration have to be possitive');
  });

  it('findAll shoudl return all tracks', async () => {
    const tracks : TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(tracksList.length);
  });


  it('findOne should return a track by id', async () => {
    const storedTrack: TrackEntity = tracksList[0];
    const track: TrackEntity = await service.findOne(storedTrack.id);
    expect(track).not.toBeNull();
    expect(track.nombre).toEqual(storedTrack.nombre);
    expect(track.duracion).toEqual(storedTrack.duracion);
 
  });

  it('findOne should throw an exception for an invalid track', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The track with the given id was not found');
  });


});
  