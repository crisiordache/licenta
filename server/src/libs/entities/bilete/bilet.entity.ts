import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Comanda } from '../comenzi/comanda.entity';
import { Eveniment } from '../evenimente/eveniment.entity';
import { TipBilet } from '../tipuriBilet/tipBilet.entity';
import { Loc } from '../locuri/loc.entity';

@Entity()
export class Bilet {
  @PrimaryGeneratedColumn()
  idBilet: number;

  @Column()
  codQR: string;

  @ManyToOne(() => Comanda, (comanda) => comanda.bilete)
  comanda: Comanda;

  @ManyToOne(() => Eveniment, (eveniment) => eveniment.bilete)
  eveniment: Eveniment;

  @ManyToOne(() => TipBilet, (tipBilet) => tipBilet.bilete)
  tipBilet: TipBilet;

  @OneToMany(() => Loc, (loc) => loc.bilete)
  loc: Loc;
}
