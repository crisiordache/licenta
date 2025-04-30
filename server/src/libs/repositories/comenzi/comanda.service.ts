import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comanda } from 'src/libs/entities/comenzi/comanda.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComenziService {
  constructor(
    @InjectRepository(Comanda)
    private comenziRepository: Repository<Comanda>,
  ) {}

  create(Comanda: Comanda): Promise<Comanda> {
    return this.comenziRepository.save(Comanda);
  }

  findAll(): Promise<Comanda[]> {
    return this.comenziRepository.find();
  }

  findOne(idComanda: number): Promise<Comanda | null> {
    return this.comenziRepository.findOneBy({ idComanda });
  }

  async remove(id: number): Promise<void> {
    await this.comenziRepository.delete(id);
  }
}
