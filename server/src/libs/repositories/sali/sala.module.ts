import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sala } from 'src/libs/entities/sali/sala.entity';
import { SaliService } from './sala.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sala])],
  providers: [SaliService],
  controllers: [],
})
export class SaliModule {}
