import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SocioDto } from 'src/socio/socio.dto';
import { SocioEntity } from 'src/socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {

    constructor(private readonly socioClubService: SocioClubService) { }

    @Post(':clubId/members/:socioId')
    async addSocioToClub(@Param('clubId') clubId: number, @Param('socioId') socioId: number) {
        return await this.socioClubService.addSocioToClub(clubId, socioId);
    }


    @Get(':clubId/members/:socioId')
    async findSocioFromClub(@Param('clubId') clubId: number, @Param('socioId') socioId: number) {
        return await this.socioClubService.findSocioFromClub(clubId, socioId);
    }

    @Get(':clubId/members')
    async findSociosFromClub(@Param('clubId') clubId: number) {
        return await this.socioClubService.findSociosFromClub(clubId);
    }

    @Put(':clubId/members')
    async associateSociosClub(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: number) {
        const socios = plainToInstance(SocioEntity, sociosDto)
        return await this.socioClubService.associateSociosClub(clubId, socios);
    }

    @Delete(':clubId/members/:socioId')
    @HttpCode(204)
    async deleteSocioFromClub(@Param('clubId') clubId: number, @Param('socioId') socioId: number) {
        return await this.socioClubService.deleteSocioFromClub(clubId, socioId);
    }
}
