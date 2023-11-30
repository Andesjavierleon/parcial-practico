import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClubService } from './club.service';
import { ClubDto } from './club.dto';
import { ClubEntity } from './club.entity';
import { plainToInstance } from 'class-transformer';

@Controller('club')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
    constructor(private readonly clubService: ClubService) {}

    @Get()
    async findAll() {
      return await this.clubService.findAll();
    }
  
    @Get(':clubId')
    async findOne(@Param('clubId') clubId: number) {
      return await this.clubService.findOne(clubId);
    }
  
    @Post()
    async create(@Body() clubDto: ClubDto) {
      const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
      return await this.clubService.create(club);
    }
  
    @Put(':clubId')
    async update(@Param('clubId') clubId: number, @Body() clubDto: ClubDto) {
      const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
      return await this.clubService.update(clubId, club);
    }
  
    @Delete(':clubId')
    @HttpCode(204)
    async delete(@Param('clubId') clubId: number) {
      return await this.clubService.delete(clubId);
    }
}
