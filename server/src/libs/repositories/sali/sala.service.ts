import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLocDTO } from 'src/libs/dto/locuri/loc.dto';
import { CreateSalaDTO } from 'src/libs/dto/sali/sala.dto';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { Sala } from 'src/libs/entities/sali/sala.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SaliService {
  constructor(
    @InjectRepository(Sala)
    private saliRepository: Repository<Sala>,
    @InjectRepository(Loc)
    private locuriRepository: Repository<Loc>,
  ) {}

  async create(createSalaDto: CreateSalaDTO): Promise<Sala> {
    const { numeSala, adresa, capacitate, structura } = createSalaDto;

    const salaNoua = this.saliRepository.create({
      numeSala,
      adresa,
      capacitate,
      structura: JSON.stringify(structura),
    });

    const salaSalvata = await this.saliRepository.save(salaNoua);

    const locuriDataArray = JSON.parse(salaSalvata.structura) as Loc[];

    const locuri = locuriDataArray.map((locData: CreateLocDTO) => {
      const loc = this.locuriRepository.create({
        rand: locData.rand,
        numar: locData.numar,
        x: locData.x,
        y: locData.y,
        sala: salaSalvata,
      });
      return loc;
    });

    await this.locuriRepository.save(locuri);

    return salaSalvata;
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
