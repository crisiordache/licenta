import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSalaDTO } from 'src/libs/dto/sali/sala.dto';
import { Sala } from 'src/libs/entities/sali/sala.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SaliService {
  constructor(
    @InjectRepository(Sala)
    private saliRepository: Repository<Sala>,
  ) {}

  async create(createSalaDTO: CreateSalaDTO): Promise<Sala> {
    const sala = this.saliRepository.create(createSalaDTO);
    return await this.saliRepository.save(sala);
  }

  findAll(): Promise<Sala[]> {
    return this.saliRepository.find();
  }

  findOne(idSala: number): Promise<Sala | null> {
    return this.saliRepository.findOneBy({ idSala });
  }

  async remove(id: number): Promise<void> {
    await this.saliRepository.delete(id);
  }

  async update(id: number, updateSalaDto: CreateSalaDTO): Promise<Sala> {
    await this.saliRepository.update(id, updateSalaDto);
    const salaNoua = await this.findOne(id);
    if (!salaNoua) {
      throw new NotFoundException(`Sala cu id ${id} nu a fost gasita`);
    }
    return salaNoua;
  }
}
