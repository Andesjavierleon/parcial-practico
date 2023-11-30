import { Test, TestingModule } from '@nestjs/testing';
import { SocioClubService } from './socio-club.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from '../socio/socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let sociosList: SocioEntity[];
  let club: ClubEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    socioRepository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    clubRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();
    sociosList = [];

    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        nombreUsuario: faker.company.name(),
        correoElectronico: faker.internet.email(),
        fechaNacimiento: faker.date.recent()
      });
      sociosList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.recent(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence(),
      socios: sociosList
    })
  };

  it('addSocioToClub should add an socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.company.name(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent()
    });

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.recent(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence()
    })

    const result: ClubEntity = await service.addSocioToClub(newClub.id, newSocio.id);

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombreUsuario).toBe(newSocio.nombreUsuario)
    expect(result.socios[0].correoElectronico).toBe(newSocio.correoElectronico)
    expect(result.socios[0].fechaNacimiento).toEqual(newSocio.fechaNacimiento)
  });

  it('addSocioToClub should thrown exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.recent(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.addSocioToClub(newClub.id, 0)).rejects.toHaveProperty("message", "El socio con el ID dado no fue encontrado");
  });

  it('addSocioToClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.company.name(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent()
    });

    await expect(() => service.addSocioToClub(0, newSocio.id)).rejects.toHaveProperty("message", "El club con el ID dado no fue encontrado");
  });

  it('findSocioFromClub should return socio by club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findSocioFromClub(club.id, socio.id)
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toBe(socio.nombreUsuario);
    expect(storedSocio.correoElectronico).toBe(socio.correoElectronico);
    expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento);
  });

  it('findSocioFromClub should throw an exception for an invalid socio', async () => {
    await expect(() => service.findSocioFromClub(club.id, 0)).rejects.toHaveProperty("message", "El socio con el ID dado no fue encontrado");
  });

  it('findSocioFromClub should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.findSocioFromClub(0, socio.id)).rejects.toHaveProperty("message", "El club con el ID dado no fue encontrado");
  });

  it('findSocioFromClub should throw an exception for an socio not associated to the club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.company.name(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent()
    });

    await expect(() => service.findSocioFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "El socio con el ID dado no está asociado al club");
  });

  it('findSociosFromClub should return socios by club', async () => {
    const socios: SocioEntity[] = await service.findSociosFromClub(club.id);
    expect(socios.length).toBe(5)
  });

  it('findSociosFromClub should throw an exception for an invalid club', async () => {
    await expect(() => service.findSociosFromClub(0)).rejects.toHaveProperty("message", "El club con el ID dado no fue encontrado");
  });

  it('associateSociosClub should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.company.name(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent()
    });

    const updatedClub: ClubEntity = await service.associateSociosClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);

    expect(updatedClub.socios[0].nombreUsuario).toBe(newSocio.nombreUsuario);
    expect(updatedClub.socios[0].correoElectronico).toBe(newSocio.correoElectronico);
    expect(updatedClub.socios[0].fechaNacimiento).toEqual(newSocio.fechaNacimiento);
  });

  it('associateSociosClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.company.name(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent()
    });

    await expect(() => service.associateSociosClub(0, [newSocio])).rejects.toHaveProperty("message", "El club con el ID dado no fue encontrado");
  });

  it('associateSociosClub should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = 0;

    await expect(() => service.associateSociosClub(club.id, [newSocio])).rejects.toHaveProperty("message", "El socio con el ID dado no fue encontrado");
  });

  it('deleteSocioToClub should remove an socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];

    await service.deleteSocioFromClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({ where: { id: club.id }, relations: ["socios"] });
    const deletedSocio: SocioEntity = storedClub.socios.find(a => a.id === socio.id);

    expect(deletedSocio).toBeUndefined();

  });

  it('deleteSocioToClub should thrown an exception for an invalid socio', async () => {
    await expect(() => service.deleteSocioFromClub(club.id, 0)).rejects.toHaveProperty("message", "El socio con el ID dado no fue encontrado");
  });

  it('deleteSocioToClub should thrown an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.deleteSocioFromClub(0, socio.id)).rejects.toHaveProperty("message", "El club con el ID dado no fue encontrado");
  });

  it('deleteSocioToClub should thrown an exception for an non asocciated socio', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.company.name(),
      correoElectronico: faker.internet.email(),
      fechaNacimiento: faker.date.recent()
    });

    await expect(() => service.deleteSocioFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "El socio con el ID dado no está asociado al club");
  });
});