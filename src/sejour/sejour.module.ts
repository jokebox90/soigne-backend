import { Module } from '@nestjs/common';
import { SejourController } from './sejour.controller';
import { SejourService } from './sejour.service';
import { Sejour } from './sejour.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medecin } from 'src/medecin/medecin.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sejour, Medecin, User])],
  controllers: [SejourController],
  providers: [SejourService]
})
export class SejourModule { }
