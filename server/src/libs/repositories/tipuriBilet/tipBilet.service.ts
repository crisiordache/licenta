import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipBiletDTO } from 'src/libs/dto/tipuriBilet/tipBilet.dto';
import { TipBilet } from 'src/libs/entities/tipuriBilet/tipBilet.entity';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { BileteService } from '../bilete/bilet.service';

@Injectable()
export class TipuriBiletService {
  constructor(
    @InjectRepository(TipBilet)
    private readonly tipuriBiletRepository: Repository<TipBilet>,
    private readonly bileteService: BileteService,
  ) {}

  async create(
    dto: CreateTipBiletDTO,
    locuriDisponibile: Loc[] = [],
  ): Promise<TipBilet> {
    const tipBiletNou = this.tipuriBiletRepository.create({
      numeTip: dto.numeTip,
      pret: dto.pret,
      stocDisponibil: dto.stocDisponibil,
      eveniment: dto.eveniment,
    });

    const tipBiletSalvat = await this.tipuriBiletRepository.save(tipBiletNou);

    for (let i = 0; i < dto.stocDisponibil; i++) {
      const loc = dto.eveniment.cuLocNominal
        ? (locuriDisponibile[i] ?? null)
        : null;

      await this.bileteService.create(dto.eveniment, tipBiletSalvat, loc);
    }

    return tipBiletSalvat;
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
