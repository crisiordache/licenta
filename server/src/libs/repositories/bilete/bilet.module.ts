import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bilet } from 'src/libs/entities/bilete/bilet.entity';
import { BileteService } from './bilet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bilet])],
  providers: [BileteService],
  controllers: [],
})
export class BileteModule {}
