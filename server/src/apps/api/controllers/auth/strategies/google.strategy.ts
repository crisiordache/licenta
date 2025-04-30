/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilizator } from 'src/libs/entities/utilizatori/utilizator.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(Utilizator)
    private userRepository: Repository<Utilizator>,
  ) {
    const clientID = process.env.GOOGLE_CLIENT_ID as string;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
    const callbackURL = process.env.CALLBACK_URL;
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }

  async validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<Utilizator> {
    try {
      const googleId = profile?.id;
      const email = profile?.emails?.[0]?.value;
      const displayName = profile?.displayName || '';
      const avatar = profile?.photos?.[0]?.value || '';

      if (!email || !googleId) {
        throw new InternalServerErrorException('Missing email or Google ID');
      }

      let user = await this.userRepository.findOne({
        where: [{ googleId }, { email }],
      });

      if (!user) {
        const [nume, prenume] = displayName.split(' ');
        user = this.userRepository.create({
          googleId,
          email,
          nume: nume || '',
          prenume: prenume || '',
          avatar,
        });

        await this.userRepository.save(user);
      }

      done(null, user);
      return user;
    } catch (error) {
      console.error('GoogleStrategy validate error:', error);
      done(error, undefined);
      throw error;
    }
  }
}
