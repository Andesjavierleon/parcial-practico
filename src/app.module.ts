import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { SocioClubModule } from './socio-club/socio-club.module';
import { SocioEntity } from './socio/socio.entity';
import { ClubEntity } from './club/club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [SocioModule, ClubModule, SocioClubModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ParcialPracticoDB',
      entities: [SocioEntity, ClubEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true

    }),
    SocioModule,
    ClubModule,
    SocioClubModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
