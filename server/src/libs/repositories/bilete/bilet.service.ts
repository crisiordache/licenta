import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bilet } from 'src/libs/entities/bilete/bilet.entity';
import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { TipBilet } from 'src/libs/entities/tipuriBilet/tipBilet.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Redis, Pipeline } from 'ioredis';
import { RedisService } from 'src/libs/redis/redis.service';

@Injectable()
export class BileteService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Bilet)
    private bileteRepository: Repository<Bilet>,
  ) {}

  async create(
    eveniment: Eveniment,
    tipBilet: TipBilet,
    loc?: Loc | null,
    multi?: Redis | Pipeline,
  ): Promise<Bilet> {
    const codQR = uuidv4();
    const biletNou = this.bileteRepository.create({
      codQR: codQR,
      esteRezervat: false,
      esteCumparat: false,
      eveniment: eveniment,
      tipBilet: tipBilet,
      loc: loc ?? null,
    });
    const biletSalvat = await this.bileteRepository.save(biletNou);

    const redisClient = this.redisService.getClient();
    const biletRedisKey = `bilet:${biletSalvat.idBilet}:status`;

    if (multi) {
      (multi as Pipeline).set(biletRedisKey, 'liber');
    } else {
      await redisClient.set(biletRedisKey, 'liber');
    }

    return biletSalvat;
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
