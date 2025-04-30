import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { LocuriService } from './loc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loc])],
  providers: [LocuriService],
  controllers: [],
})
export class LocuriModule {}
