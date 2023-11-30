import { Module } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubEntity } from 'src/club/club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioClubController } from './socio-club.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
    providers: [SocioClubService],
    controllers: [SocioClubController]
})
export class SocioClubModule { }
