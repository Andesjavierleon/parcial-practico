import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        nombreUsuario: faker.company.name(),
        correoElectronico: faker.internet.email(),
        fechaNacimiento: faker.date.recent(),
      });
      sociosList.push(socio);
    }
  };

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne should return a socio by id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombreUsuario).toEqual(storedSocio.nombreUsuario)
    expect(socio.correoElectronico).toEqual(storedSocio.correoElectronico)
    expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "El socio con el ID dado no fue encontrado")
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: 0,
      nombreUsuario: faker.company.name(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent(),
      clubes: []
    }

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({ where: { id: newSocio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(newSocio.nombreUsuario)
    expect(storedSocio.correoElectronico).toEqual(newSocio.correoElectronico)
    expect(storedSocio.fechaNacimiento).toEqual(newSocio.fechaNacimiento)
  });

  it('update should modify a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.nombreUsuario = "New nombreUsuario";
    socio.fechaNacimiento = faker.date.recent();
    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();
    const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(socio.nombreUsuario)
    expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento)
  });

  it('update should throw an exception for an invalid socio', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio, nombreUsuario: "New nombreUsuario", fechaNacimiento: faker.date.recent()
    }
    await expect(() => service.update(0, socio)).rejects.toHaveProperty("message", "El socio con el ID dado no fue encontrado")
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
    const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El socio con el ID dado no fue encontrado")
  });

});
