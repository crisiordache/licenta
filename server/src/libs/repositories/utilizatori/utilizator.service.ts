import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilizator } from 'src/libs/entities/utilizatori/utilizator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UtilizatoriService {
  constructor(
    @InjectRepository(Utilizator)
    private utilizatoriRepository: Repository<Utilizator>,
  ) {}

  create(utilizator: Utilizator): Promise<Utilizator> {
    return this.utilizatoriRepository.save(utilizator);
  }

  findAll(): Promise<Utilizator[]> {
    return this.utilizatoriRepository.find();
  }

  findOne(idUtilizator: number): Promise<Utilizator | null> {
    return this.utilizatoriRepository.findOneBy({ idUtilizator });
  }

  async remove(id: number): Promise<void> {
    await this.utilizatoriRepository.delete(id);
  }
}
