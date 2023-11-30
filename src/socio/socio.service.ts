import { Injectable } from '@nestjs/common';
import { SocioEntity } from './socio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';

@Injectable()
export class SocioService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) { }

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubes"] });
    }

    async findOne(id: number): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({ where: { id }, relations: ["clubes"] });
        if (!socio)
            throw new BusinessLogicException("El socio con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        if (!socio.correoElectronico.includes('@')) {
            throw new BusinessLogicException('El campo "correoElectronico" debe contener el carácter "@"', BusinessError.PRECONDITION_FAILED);
        }
        return await this.socioRepository.save(socio);
    }

    async update(id: number, socio: SocioEntity): Promise<SocioEntity> {
        if (!socio.correoElectronico.includes('@')) {
            throw new BusinessLogicException('El campo "correoElectronico" debe contener el carácter "@"', BusinessError.PRECONDITION_FAILED);
        }
        
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({ where: { id } });
        if (!persistedSocio)
            throw new BusinessLogicException("El socio con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        socio.id = id;

        return await this.socioRepository.save(socio);
    }

    async delete(id: number) {
        const socio: SocioEntity = await this.socioRepository.findOne({ where: { id } });
        if (!socio)
            throw new BusinessLogicException("El socio con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        await this.socioRepository.remove(socio);
    }
}
