import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sala } from 'src/libs/entities/sali/sala.entity';
import { SaliService } from './sala.service';
import { SaliController } from 'src/apps/api/controllers/evenimente/sali.controller';
import { Loc } from 'src/libs/entities/locuri/loc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sala, Loc])],
  providers: [SaliService],
  controllers: [SaliController],
})
export class SaliModule {}
