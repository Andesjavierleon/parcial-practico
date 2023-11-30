import { Module } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubEntity } from 'src/club/club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
    providers: [SocioClubService]
})
export class SocioClubModule { }
