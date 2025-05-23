import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Utilizator } from 'src/libs/entities/utilizatori/utilizator.entity';
import { Bilet } from './libs/entities/bilete/bilet.entity';
import { Comanda } from './libs/entities/comenzi/comanda.entity';
import { Eveniment } from './libs/entities/evenimente/eveniment.entity';
import { Loc } from './libs/entities/locuri/loc.entity';
import { Sala } from './libs/entities/sali/sala.entity';
import { TipBilet } from './libs/entities/tipuriBilet/tipBilet.entity';
import { AuthModule } from './apps/api/controllers/auth/auth.module';
import { SaliModule } from './libs/repositories/sali/sala.module';
import { EvenimenteModule } from './libs/repositories/evenimente/eveniment.module';
import { LocuriModule } from './libs/repositories/locuri/loc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: +configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Utilizator, Comanda, Bilet, Eveniment, Loc, Sala, TipBilet],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    SaliModule,
    EvenimenteModule,
    LocuriModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
