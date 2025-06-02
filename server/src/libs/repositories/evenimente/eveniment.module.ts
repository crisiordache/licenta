import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { EvenimenteService } from './eveniment.service';
import { EvenimenteController } from 'src/apps/api/controllers/evenimente/evenimente.controller';
import { Sala } from 'src/libs/entities/sali/sala.entity';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { TipBilet } from 'src/libs/entities/tipuriBilet/tipBilet.entity';
import { Bilet } from 'src/libs/entities/bilete/bilet.entity';
import { TipuriBiletModule } from '../tipuriBilet/tipBilet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Eveniment, Sala, Loc, TipBilet, Bilet]),
    TipuriBiletModule,
  ],
  providers: [EvenimenteService],
  controllers: [EvenimenteController],
})
export class EvenimenteModule {}
