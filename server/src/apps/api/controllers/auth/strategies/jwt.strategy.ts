/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  RolUtilizator,
  Utilizator,
} from 'src/libs/entities/utilizatori/utilizator.entity';
dotenv.config();

export type JwtPayload = {
  sub: number;
  email: string;
  avatar: string;
  rol: RolUtilizator;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(Utilizator)
    private utilizatorRepository: Repository<Utilizator>,
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: JwtPayload) {
    const utilizator = await this.utilizatorRepository.findOne({
      where: { idUtilizator: payload.sub },
    });

    if (!utilizator) {
      throw new UnauthorizedException('Este necesara autentificarea');
    }

    return {
      id: payload.sub,
      email: payload.email,
      avatar: payload.avatar,
      rol: payload.rol,
    };
  }
}
