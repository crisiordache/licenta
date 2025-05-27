import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { TipBilet } from 'src/libs/entities/tipuriBilet/tipBilet.entity';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { Sala } from 'src/libs/entities/sali/sala.entity';

import { CreateEvenimentDTO } from 'src/libs/dto/evenimente/eveniment.dto';
@Injectable()
export class EvenimenteService {
  constructor(
    @InjectRepository(Eveniment)
    private evenimentRepository: Repository<Eveniment>,
    @InjectRepository(TipBilet)
    private tipBiletRepository: Repository<TipBilet>,
    @InjectRepository(Loc)
    private locRepository: Repository<Loc>,
    @InjectRepository(Sala)
    private salaRepository: Repository<Sala>,
  ) {}

  async create(createEvenimentDto: CreateEvenimentDTO): Promise<Eveniment> {
    const {
      numeEveniment,
      descriere,
      dataEveniment,
      oraIncepere,
      durataEveniment,
      cuLocNominal,
      idSala,
      poster,
      pretBiletGeneralImplicit,
      tipuriBilete,
    } = createEvenimentDto;

    const sala = await this.salaRepository.findOne({
      where: { idSala: idSala },
    });
    if (!sala) {
      throw new BadRequestException('Sala specificată nu există.');
    }

    const eventDate = new Date(dataEveniment);
    const eventStartTime = new Date(`${dataEveniment}T${oraIncepere}:00`);
    const eventEndTime = new Date(
      eventStartTime.getTime() + durataEveniment * 60 * 1000,
    );

    const overlappingEvents = await this.evenimentRepository
      .createQueryBuilder('eveniment')
      .leftJoinAndSelect('eveniment.sala', 'sala')
      .where('eveniment.sala.idSala = :idSala', { idSala: sala.idSala })
      .andWhere('eveniment.dataEveniment = :dataEveniment', {
        dataEveniment: eventDate.toISOString().split('T')[0],
      })
      .getMany();

    for (const existingEvent of overlappingEvents) {
      const existingEventStartTime = new Date(
        `${existingEvent.dataEveniment.toISOString().split('T')[0]}T${existingEvent.oraIncepere}:00`,
      );
      const existingEventEndTime = new Date(
        existingEventStartTime.getTime() +
          existingEvent.durataEveniment * 60 * 1000,
      );

      if (
        eventStartTime < existingEventEndTime &&
        existingEventStartTime < eventEndTime
      ) {
        throw new BadRequestException(
          `Sala ${sala.numeSala} este ocupată în intervalul ${existingEvent.oraIncepere} - ${new Date(existingEventEndTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} din cauza evenimentului "${existingEvent.numeEveniment}".`,
        );
      }
    }
    const evenimentNou = this.evenimentRepository.create({
      numeEveniment,
      descriere,
      dataEveniment: eventDate,
      oraIncepere,
      durataEveniment,
      cuLocNominal,
      poster: poster || '',
      sala: sala,
    });

    const evenimentSalvat = await this.evenimentRepository.save(evenimentNou);

    if (cuLocNominal) {
      if (!tipuriBilete || tipuriBilete.length === 0) {
        throw new BadRequestException(
          'Trebuie să adaugi cel puțin un tip de bilet nominal.',
        );
      }

      for (const tipBiletDto of tipuriBilete) {
        const tipBiletNou = this.tipBiletRepository.create({
          numeTip: tipBiletDto.numeTip,
          pret: tipBiletDto.pret,
          eveniment: evenimentSalvat,
        });

        const tipBiletSalvat = await this.tipBiletRepository.save(tipBiletNou);

        if (tipBiletDto.locuri && tipBiletDto.locuri.length > 0) {
          const locuriToAssign: Loc[] = [];
          for (const locData of tipBiletDto.locuri) {
            const loc = await this.locRepository.findOne({
              where: {
                rand: locData.rand,
                numar: locData.numar,
                x: locData.x,
                y: locData.y,
              },
            });
            if (loc) {
              locuriToAssign.push(loc);
            }
          }
          tipBiletSalvat.locuri = locuriToAssign;
          await this.tipBiletRepository.save(tipBiletSalvat);
        }
      }
    } else {
      if (
        pretBiletGeneralImplicit === undefined ||
        pretBiletGeneralImplicit <= 0
      ) {
        throw new BadRequestException(
          'Prețul biletului general trebuie să fie un număr pozitiv pentru evenimentele fără locuri nominale.',
        );
      }

      const defaultTipBilet = this.tipBiletRepository.create({
        numeTip: 'General Admission',
        pret: pretBiletGeneralImplicit,
        eveniment: evenimentSalvat,
        // locuriAsignate: [],
      });
      await this.tipBiletRepository.save(defaultTipBilet);
    }
    return evenimentSalvat;
  }

  findAll(): Promise<Eveniment[]> {
    return this.evenimentRepository.find({
      relations: ['sala', 'tipuriBilet', 'tipuriBilet.locuri'],
    });
  }
}
