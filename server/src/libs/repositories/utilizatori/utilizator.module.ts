import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilizator } from 'src/libs/entities/utilizatori/utilizator.entity';
import { UtilizatoriService } from './utilizator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Utilizator])],
  providers: [UtilizatoriService],
  controllers: [],
})
export class UtilizatoriModule {}
