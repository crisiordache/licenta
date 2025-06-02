import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { TipuriBiletService } from '../tipuriBilet/tipBilet.service';
import { CreateEvenimentDTO } from 'src/libs/dto/evenimente/eveniment.dto';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { Sala } from 'src/libs/entities/sali/sala.entity';

@Injectable()
export class EvenimenteService {
  constructor(
    @InjectRepository(Eveniment)
    private evenimentRepository: Repository<Eveniment>,
    @InjectRepository(Sala)
    private salaRepository: Repository<Sala>,
    private readonly tipBiletService: TipuriBiletService,
  ) {}

  async create(dto: CreateEvenimentDTO): Promise<Eveniment> {
    const sala = await this.salaRepository.findOne({
      where: { idSala: dto.idSala },
      relations: ['locuri'],
    });

    if (!sala) {
      throw new NotFoundException(`Sala cu ID ${dto.idSala} nu a fost găsită.`);
    }

    const evenimentNou = this.evenimentRepository.create({
      numeEveniment: dto.numeEveniment,
      descriere: dto.descriere,
      dataEveniment: new Date(dto.dataEveniment),
      oraIncepere: dto.oraIncepere,
      durataEveniment: dto.durataEveniment,
      cuLocNominal: dto.cuLocNominal,
      poster: dto.poster ?? '',
      sala: sala,
    });

    const evenimentSalvat = await this.evenimentRepository.save(evenimentNou);

    if (dto.tipuriBilete && dto.tipuriBilete?.length > 0) {
      const locuriDisponibile: Loc[] = dto.cuLocNominal ? sala.locuri : [];

      for (const tipBiletDTO of dto.tipuriBilete) {
        await this.tipBiletService.create(
          {
            ...tipBiletDTO,
            eveniment: evenimentSalvat,
          },
          locuriDisponibile,
        );
      }
    }

    return evenimentSalvat;
  }

  findAll(): Promise<Eveniment[]> {
    return this.evenimentRepository.find({
      relations: [
        'sala',
        'tipuriBilet',
        'bilete',
        'bilete.loc',
        'bilete.tipBilet',
      ],
    });
  }

  findOne(idEveniment: number): Promise<Eveniment | null> {
    return this.evenimentRepository.findOne({
      where: { idEveniment },
      relations: [
        'sala',
        'tipuriBilet',
        'bilete',
        'bilete.loc',
        'bilete.tipBilet',
      ],
    });
  }
}
