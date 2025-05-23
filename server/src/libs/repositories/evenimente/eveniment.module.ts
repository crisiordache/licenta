import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { EvenimenteService } from './eveniment.service';
import { EvenimenteController } from 'src/apps/api/controllers/evenimente/evenimente.controller';
import { Sala } from 'src/libs/entities/sali/sala.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Eveniment, Sala])],
  providers: [EvenimenteService],
  controllers: [EvenimenteController],
})
export class EvenimenteModule {}
