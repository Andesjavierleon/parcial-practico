import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SocioService } from './socio.service';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { plainToInstance } from 'class-transformer';

@Controller('socio')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
    constructor(private readonly socioService: SocioService) {}

    @Get()
    async findAll() {
      return await this.socioService.findAll();
    }
  
    @Get(':socioId')
    async findOne(@Param('socioId') socioId: number) {
      return await this.socioService.findOne(socioId);
    }
  
    @Post()
    async create(@Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.create(socio);
    }
  
    @Put(':socioId')
    async update(@Param('socioId') socioId: number, @Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.update(socioId, socio);
    }
  
    @Delete(':socioId')
    @HttpCode(204)
    async delete(@Param('socioId') socioId: number) {
      return await this.socioService.delete(socioId);
    }
}

