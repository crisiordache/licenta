import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bilet } from 'src/libs/entities/bilete/bilet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BileteService {
  constructor(
    @InjectRepository(Bilet)
    private bileteRepository: Repository<Bilet>,
  ) {}

  create(bilet: Bilet): Promise<Bilet> {
    return this.bileteRepository.save(bilet);
  }

  findAll(): Promise<Bilet[]> {
    return this.bileteRepository.find();
  }

  findOne(idBilet: number): Promise<Bilet | null> {
    return this.bileteRepository.findOneBy({ idBilet });
  }

  async remove(id: number): Promise<void> {
    await this.bileteRepository.delete(id);
  }
}
