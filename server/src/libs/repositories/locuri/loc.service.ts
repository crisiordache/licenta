import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLocDTO } from 'src/libs/dto/locuri/loc.dto';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocuriService {
  constructor(
    @InjectRepository(Loc)
    private locuriRepository: Repository<Loc>,
  ) {}

  async create(createLocDTO: CreateLocDTO): Promise<Loc> {
    const loc = this.locuriRepository.create(createLocDTO);
    return await this.locuriRepository.save(loc);
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

  async update(id: number, updateLocDto: CreateLocDTO): Promise<Loc> {
    await this.locuriRepository.update(id, updateLocDto);
    const salaNoua = await this.findOne(id);
    if (!salaNoua) {
      throw new NotFoundException(`Locul cu id ${id} nu a fost gasit`);
    }
    return salaNoua;
  }
}
