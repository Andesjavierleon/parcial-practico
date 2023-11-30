import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        nombre: faker.company.name(),
        fechaFundacion: faker.date.recent(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentence(),
      });
      clubsList.push(club);
    }
  };

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)
    expect(club.imagen).toEqual(storedClub.imagen)
    expect(club.fechaFundacion).toEqual(storedClub.fechaFundacion)
    expect(club.descripcion).toEqual(storedClub.descripcion)
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "El club con el ID dado no fue encontrado")
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: 0,
      nombre: faker.company.name(),
      imagen: faker.image.url(),
      fechaFundacion: faker.date.recent(),
      descripcion: faker.lorem.sentence(),
      socios: []
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({ where: { id: newClub.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre)
    expect(storedClub.imagen).toEqual(newClub.imagen)
    expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion)
    expect(storedClub.descripcion).toEqual(newClub.descripcion)
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubsList[0];
    club.nombre = "New nombre";
    club.fechaFundacion = faker.date.recent();
    club.descripcion = faker.lorem.sentence();
    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)
    expect(storedClub.fechaFundacion).toEqual(club.fechaFundacion)
    expect(storedClub.descripcion).toEqual(club.descripcion)
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubsList[0];
    club = {
      ...club, nombre: "New nombre", fechaFundacion: faker.date.recent(), descripcion: faker.lorem.sentence()
    }
    await expect(() => service.update(0, club)).rejects.toHaveProperty("message", "El club con el ID dado no fue encontrado")
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);
    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubsList[0];
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El club con el ID dado no fue encontrado")
  });

});
