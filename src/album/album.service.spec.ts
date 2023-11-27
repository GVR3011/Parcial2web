import { Test, TestingModule } from '@nestjs/testing';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker} from '@faker-js/faker';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';


describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    
    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    albumList = []
    for(let i = 0; i < 10; i++){
      const album: AlbumEntity = await repository.save({
        nombre: faker.name.firstName(),
        caratula: faker.lorem.sentence(),
        fecha: faker.date.past(),
        descripcion: faker.lorem.sentence(),
        tracks: [],
        performers: []
      });
      albumList.push(album);
    };
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new album', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.name.firstName(),
      caratula: faker.lorem.sentence(),
      fecha: faker.date.between('2020-01-01T00:00:00.000Z', '2030-01-01T00:00:00.000Z'),
      descripcion: faker.lorem.sentence(),
      tracks: [],
      performers: []
    }
    
    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();
 
    const storedAlbum: AlbumEntity = await repository.findOne({where: {id: newAlbum.id}})
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.nombre).toEqual(newAlbum.nombre)
    expect(storedAlbum.descripcion).toEqual(newAlbum.descripcion)
    expect(storedAlbum.fecha).toEqual(newAlbum.fecha)
    expect(storedAlbum.caratula).toEqual(newAlbum.caratula)
  });

  //funcion findAll
  it('findAll shoudl return all albums', async () => {
    const albums : AlbumEntity[] = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums).toHaveLength(albumList.length);
  });

  //funcion findOne
  it('findOne should return a album by id', async () => {
    const storedAlbum: AlbumEntity = albumList[0];
    const album: AlbumEntity = await service.findOne(storedAlbum.id);
    expect(album).not.toBeNull();
    expect(album.nombre).toEqual(storedAlbum.nombre);
    expect(album.caratula).toEqual(storedAlbum.caratula);
    expect(album.fecha).toEqual(storedAlbum.fecha);
    expect(album.descripcion).toEqual(storedAlbum.descripcion);
  });

  it('findOne should throw an exception for an invalid album', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The album with the given id was not found');
  });

  //funcion create y descripcion
  it('create an album with empty description should thrown exception', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.name.firstName(),
      caratula: faker.lorem.sentence(100),
      fecha: faker.date.past(),
      descripcion:'',
      tracks: [],
      performers: []
    }
    await expect(() => service.create(album)).rejects.toHaveProperty('message', 'The album descripcion is required');
  });

  //funcion delete
  it('delete should delete an existing album', async () => {
    const album: AlbumEntity = albumList[0];
    await service.delete(album.id);
    const deletALbum: AlbumEntity = await repository.findOne({where: {id: album.id} });
    expect(deletALbum).toBeNull();
  });

  it('delete should throw an exception for an invalid album', async () => {
    const user: AlbumEntity = albumList[0];
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', 'The album with the given id was not found');
  });
  
});