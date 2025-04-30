import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEvenimentDTO } from 'src/libs/dto/evenimente/eveniment.dto';
import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { Sala } from 'src/libs/entities/sali/sala.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvenimenteService {
  constructor(
    @InjectRepository(Eveniment)
    private evenimenteRepository: Repository<Eveniment>,
    @InjectRepository(Sala)
    private saliRepository: Repository<Sala>,
  ) {}

  async create(dto: CreateEvenimentDTO): Promise<Eveniment> {
    const sala = await this.saliRepository.findOne({
      where: { idSala: dto.sala },
    });
    if (!sala) {
      throw new NotFoundException('Id invalid de sala');
    }
    const eveniment = this.evenimenteRepository.create({
      ...dto,
      sala: sala,
    });
    return this.evenimenteRepository.save(eveniment);
  }

  findAll(): Promise<Eveniment[]> {
    return this.evenimenteRepository.find({ relations: ['sala', 'bilete'] });
  }

  async findOne(idEveniment: number): Promise<Eveniment | null> {
    const eveniment = await this.evenimenteRepository.findOne({
      where: { idEveniment: idEveniment },
      relations: ['sala', 'bilete'],
    });
    if (!eveniment) {
      throw new NotFoundException('Id invalid de eveniment');
    }
    return eveniment;
  }

  async remove(id: number): Promise<void> {
    await this.evenimenteRepository.delete(id);
  }
}
