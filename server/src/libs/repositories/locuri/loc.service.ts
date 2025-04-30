import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocuriService {
  constructor(
    @InjectRepository(Loc)
    private locuriRepository: Repository<Loc>,
  ) {}

  create(Comanda: Loc): Promise<Loc> {
    return this.locuriRepository.save(Comanda);
  }

  findAll(): Promise<Loc[]> {
    return this.locuriRepository.find();
  }

  findOne(idLoc: number): Promise<Loc | null> {
    return this.locuriRepository.findOneBy({ idLoc });
  }

  async remove(id: number): Promise<void> {
    await this.locuriRepository.delete(id);
  }
}
