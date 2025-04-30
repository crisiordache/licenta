import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipBilet } from 'src/libs/entities/tipuriBilet/tipBilet.entity';
import { TipuriBiletService } from './tipBilet.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipBilet])],
  providers: [TipuriBiletService],
  controllers: [],
})
export class TipuriBiletModule {}
