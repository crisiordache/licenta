import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComenziService } from './comanda.service';
import { Comanda } from 'src/libs/entities/comenzi/comanda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comanda])],
  providers: [ComenziService],
  controllers: [],
})
export class ComenziModule {}
