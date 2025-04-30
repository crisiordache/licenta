import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipBilet } from 'src/libs/entities/tipuriBilet/tipBilet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipuriBiletService {
  constructor(
    @InjectRepository(TipBilet)
    private tipuriBiletRepository: Repository<TipBilet>,
  ) {}

  create(Comanda: TipBilet): Promise<TipBilet> {
    return this.tipuriBiletRepository.save(Comanda);
  }

  findAll(): Promise<TipBilet[]> {
    return this.tipuriBiletRepository.find();
  }

  findOne(idTipBilet: number): Promise<TipBilet | null> {
    return this.tipuriBiletRepository.findOneBy({ idTipBilet });
  }

  async remove(id: number): Promise<void> {
    await this.tipuriBiletRepository.delete(id);
  }
}
