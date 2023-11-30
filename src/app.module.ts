import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { SocioClubModule } from './socio-club/socio-club.module';

@Module({
  imports: [SocioModule, ClubModule, SocioClubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
