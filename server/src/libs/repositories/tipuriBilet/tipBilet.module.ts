import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipBilet } from 'src/libs/entities/tipuriBilet/tipBilet.entity';
import { TipuriBiletService } from './tipBilet.service';
import { BileteModule } from '../bilete/bilet.module';

@Module({
  imports: [TypeOrmModule.forFeature([TipBilet]), BileteModule],
  providers: [TipuriBiletService],
  exports: [TipuriBiletService],
  controllers: [],
})
export class TipuriBiletModule {}
