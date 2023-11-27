import { Test, TestingModule } from '@nestjs/testing';
import { PerformerService } from './performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';


describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performersList = [];
    for (let i = 0; i < 10; i++) {
      const performer: PerformerEntity = await repository.save({
        nombre: faker.name.fullName(),
        descripcion : faker.lorem.sentence(),
        imagen: faker.lorem.sentence(),
      });
      performersList.push(performer);
    };
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll shoudl return all performers', async () => {
    const performers : PerformerEntity[] = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers).toHaveLength(performersList.length);
  });

  it('findOne should return a performer by id', async () => {
    const storedPerformer: PerformerEntity = performersList[0];
    const performer: PerformerEntity = await service.findOne(storedPerformer.id);
    expect(performer).not.toBeNull();
    expect(performer.nombre).toEqual(storedPerformer.nombre);
    expect(performer.descripcion).toEqual(storedPerformer.descripcion);
    expect(performer.imagen).toEqual(storedPerformer.imagen);
  });

  it('findOne should throw an exception for an invalid performer', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The performer with the given id was not found');
  });

  it('create should create a new performer', async () => {
    const performer: PerformerEntity = {
      id: '',
      nombre: faker.name.fullName(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
      albums: []
    } 
    const createdPerformer: PerformerEntity = await service.create(performer);
    expect(createdPerformer).not.toBeNull();

    const storedPerformer: PerformerEntity = await repository.findOne({where: {id: createdPerformer.id} });
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.nombre).toEqual(performer.nombre);
    expect(storedPerformer.descripcion).toEqual(performer.descripcion);
    expect(storedPerformer.imagen).toEqual(performer.imagen);
  });

  it('create an performer with more than 100 caracteres description should thrown exception', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.name.fullName(),
      descripcion: faker.lorem.sentence(120),
      imagen: faker.image.imageUrl(),
      albums: []
    }
    await expect(() => service.create(performer)).rejects.toHaveProperty('message', 'The description cannot be more than 100 characters');
  });

});