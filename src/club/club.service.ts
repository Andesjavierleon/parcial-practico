import { Injectable } from '@nestjs/common';
import { ClubEntity } from './club.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';

@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ) { }

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["clubes"] });
    }

    async findOne(id: number): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({ where: { id }, relations: ["clubes"] });
        if (!club)
            throw new BusinessLogicException("El club con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {
        if (club.descripcion.length > 100) {
            throw new BusinessLogicException('El campo "descripcion" NO debe contener más de 100 caracteres', BusinessError.PRECONDITION_FAILED);
        }
        return await this.clubRepository.save(club);
    }

    async update(id: number, club: ClubEntity): Promise<ClubEntity> {
        if (club.descripcion.length > 100) {
            throw new BusinessLogicException('El campo "descripcion" NO debe contener más de 100 caracteres', BusinessError.PRECONDITION_FAILED);
        }
        
        const persistedClub: ClubEntity = await this.clubRepository.findOne({ where: { id } });
        if (!persistedClub)
            throw new BusinessLogicException("El club con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        club.id = id;

        return await this.clubRepository.save(club);
    }

    async delete(id: number) {
        const club: ClubEntity = await this.clubRepository.findOne({ where: { id } });
        if (!club)
            throw new BusinessLogicException("El club con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        await this.clubRepository.remove(club);
    }
}
