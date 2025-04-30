import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { EvenimenteService } from './eveniment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Eveniment])],
  providers: [EvenimenteService],
  controllers: [],
})
export class EvenimenteModule {}
