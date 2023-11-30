import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SocioClubService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>,
    
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ) {}

    async addSocioToClub(clubId: number, socioId: number): Promise<ClubEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
      
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]})
        if (!club)
          throw new BusinessLogicException("El club con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        club.socios = [...club.socios, socio];
        return await this.clubRepository.save(club);
      }
    
    async findSocioFromClub(clubId: number, socioId: number): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
       
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("El club con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
   
        const clubSocio: SocioEntity = club.socios.find(e => e.id === socio.id);
   
        if (!clubSocio)
          throw new BusinessLogicException("El socio con el ID dado no está asociado al club", BusinessError.PRECONDITION_FAILED)
   
        return clubSocio;
    }
    
    async findSociosFromClub(clubId: number): Promise<SocioEntity[]> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("El club con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
       
        return club.socios;
    }
    
    async associateSociosClub(clubId: number, socios: SocioEntity[]): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
    
        if (!club)
          throw new BusinessLogicException("El club con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < socios.length; i++) {
          const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].id}});
          if (!socio)
            throw new BusinessLogicException("El socio con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        club.socios = socios;
        return await this.clubRepository.save(club);
      }
    
    async deleteSocioFromClub(clubId: number, socioId: number){
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("El club con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const clubSocio: SocioEntity = club.socios.find(e => e.id === socio.id);
    
        if (!clubSocio)
            throw new BusinessLogicException("El socio con el ID dado no está asociado al club", BusinessError.PRECONDITION_FAILED)
 
        club.socios = club.socios.filter(e => e.id !== socioId);
        await this.clubRepository.save(club);
    }
}
