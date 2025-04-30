/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUtilizatorDTO } from 'src/libs/dto/utilizatori/utilizator.dto';
import { Utilizator } from 'src/libs/entities/utilizatori/utilizator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Utilizator)
    private utilizatorRepository: Repository<Utilizator>,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signIn(utilizator) {
    if (!utilizator) {
      throw new BadRequestException('Unauthenticated');
    }

    const utilizatorExista = await this.findUserByEmail(utilizator.email);

    if (!utilizatorExista) {
      return this.registerUser(utilizator);
    }

    return this.generateJwt({
      sub: utilizatorExista.idUtilizator,
      email: utilizatorExista.email,
    });
  }

  async registerUser(utilizator: CreateUtilizatorDTO) {
    try {
      console.log('Registering user:', utilizator);

      const utilizatorNou = this.utilizatorRepository.create({
        ...utilizator,
        comenzi: [],
      });

      await this.utilizatorRepository.save(utilizatorNou);

      return this.generateJwt({
        sub: utilizatorNou.idUtilizator,
        email: utilizatorNou.email,
      });
    } catch (error) {
      console.error('User registration failed:', error);
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string) {
    const utilizator = await this.utilizatorRepository.findOne({
      where: { email },
    });

    if (!utilizator) {
      return null;
    }

    return utilizator;
  }
}
